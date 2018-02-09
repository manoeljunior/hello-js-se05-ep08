const {knex} = require('./config')
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const axios = require('axios')
const _ = require('lodash');
const {extractComments} = require('./util')
let issues = []

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

const api = axios.create({
  baseURL: 'https://api.github.com'
})

app.get('/listall', (req, res) => {
  let comments = []
  let newResult = []
  let userGroup = ''
  knex('comments')
    .join('users', 'comments.id_user', '=', 'users.id_user')
    .join('issues', 'comments.id_issue', '=', 'issues.id')
    .where('comments.body', 'like', '%present%')
    .select('comments.body', 'users.name', 'users.avatar', 'issues.title', 'comments.id_issue')
    .orderBy('users.name').then(result => {
      result.forEach(item => {
        if(userGroup != item.name) {
          newResult.push({
            user: item.name,
            avatar: item.avatar,
            comments: extractComments(result, item.name)
          })
          userGroup = item.name
        }
      })
      res.send(newResult)
    })
})

// Search user's comments for each issue and save into database
app.post('/check', (req, res) => {
  let user = req.body.user
  let f = function(issue) {
    return api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
  }

  let userComments = { 
     user: user,
     comments: [] 
  }
  
  Promise.all([f(issues[0]), f(issues[1]), f(issues[2]), f(issues[3]), f(issues[4]), f(issues[5]), f(issues[6]), f(issues[7])]).then(results => {
    results.forEach((result, idx) => {
      let issueUserComments = result.data.filter(item => {
        return item.user.login === user
      })

      if (issueUserComments.length > 0) {
        issueUserComments.forEach(item => {
          item.id_issue = issues[idx].id
          item.id_user = item.user.id
          item.body = item.body
          userComments.comments.push(_.pick(item, ['id_issue', 'id_user', 'body', 'user' ]))
        })
      }
    })

    // persist the user and comments
    if (userComments.comments.length > 0) {
      knex('users').select().where('name', userComments.user).then(user => {
        // Dont' save the user if exists
        if (user.length == 0) {
          knex('users').insert({
            id_user: userComments.comments[0].user.id,
            name: userComments.comments[0].user.login,
            avatar: userComments.comments[0].user.avatar_url,
          }).then(userInserted => {
            let comments = []
            userComments.comments.forEach(comment => {
              let obj = _.pick(comment, ['id_issue', 'id_user', 'body'])
              comments.push(obj)
            })
            knex('comments').insert(comments).then(commentsInserted => {
              if(commentsInserted.length > 0) {
                res.send({
                  msg: 'Aluno inserido com sucesso'
                })
              }
            })
          })
        } else {
          res.send({
            msg: 'Aluno já existe'
          })
        }
      })  
    } else {
      res.send({
        msg: 'Aluno não matriculado'
      })
    }
  }).catch(err => {
    console.log(err);
    res.status(err.response.status).send({
      msg: err.response.data.message
    })
  })
})

knex.migrate.latest().then( () => {
  // Search for issues and insert into database
  knex('issues').select().then(res => {
    if (res.length == 0) {
      api.get('/repos/sombriks/hello-js-v5/issues').then(result => {
        issues = result.data.map(item => {
          return _.pick(item, ['id', 'title', 'number'])
        }).filter(item => {
          return (/SE05EP0([1-8])/).test(item.title)
        })
        return knex('issues').insert(issues)
      }).then(res => {
        if(res) console.log('Issues inserted successfully')
      })
    } else {
      issues = res
    }
  })

  // Start express server
  app.listen(3000, _ => {
    console.log('Server is running...')
  });
})