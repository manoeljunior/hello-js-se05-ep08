const {knex} = require('./config')
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const axios = require('axios')
const _ = require('lodash');
let issues = []

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

const api = axios.create({
  baseURL: 'https://api.github.com'
})

// Search user's comments for each issue and save into database
app.post('/check/:user', (req, res) => {
  // let userFound = false
  let msg = 'user not found'
  issues = [{ id: 291579075, number: 3, title: 'SE05EP01' }]
  console.log(issues)
  issues.forEach(issue => {
    if (issue.title.includes('SE05EP')) {
      // to call each issue and search for user's comments
      api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`).then(result => {
        let comments = result.data.filter(item => {
          return item.user.login === req.params.user
        })
        console.log(`${issue.title} - ${issue.number}`)
        console.log(comments)
        if (comments.length > 0) {
          //userFound = true
          console.log('Checking if user exists on database')
          knex('users').where({
            name: req.params.user
          }).select().then(users => {
            console.log(users)
            if (users.length == 0) {
              console.log('before insert!')
              // insert a new user
              knex('users').insert({
                id_user: comments[0].user.id,
                name: comments[0].user.login,
                avatar: comments[0].user.avatar_url,
              }).then(userInserted => {
                if(userInserted.length > 0) {
                  // insert user's comments
                  let payload = []
                  comments.forEach(comment => {
                    let obj = {
                      id_issue: issue.id,
                      id_user: comment.user.id,
                      comment: comment.body
                    }
                    payload.push(obj)
                  })
                  console.log(payload)
                  knex('comments').insert(payload).then(commentInsert => {
                    if(userInserted.length > 0) {
                      console.log(userInserted)
                      msg = 'Comments inserted succesfully'
                    }
                  })
                }
              })
            } else {
              console.log('......')
              msg = 'User already inserted'
            }
          })
        }
        //res.send()
      }).catch(e => {
        console.log(e)
        res.status(500).send()
      })
    }
  })
  res.send({msg})
})

knex.migrate.latest().then( () => {
  // Search for issues and insert into database
  knex('issues').select().then(res => {
    if (res.length == 0) {
      api.get('/repos/sombriks/hello-js-v5/issues').then(result => {
        issues = result.data.map(item => {
          return _.pick(item, ['id', 'title', 'number'])
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