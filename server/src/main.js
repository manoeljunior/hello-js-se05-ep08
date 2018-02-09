const {knex} = require('./config')
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const axios = require('axios')
const _ = require('lodash');
const {extractComments} = require('./util')
const {extractAllComments} = require('./util')
let issues = []

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

const api = axios.create({
  baseURL: 'https://api.github.com'
})

app.get('/list', (req, res) => {
  let obj = {
    user: '',
    comments: []
  }
  let comments = []
  let newResult = []
  let userGroup = ''
  knex('comments')
    .join('users', 'comments.id_user', '=', 'users.id_user')
    .join('issues', 'comments.id_issue', '=', 'issues.id')
    .where('comments.body', 'like', '%present%')
    .select('comments.body', 'users.name', 'issues.title', 'comments.id_issue')

    .orderBy('users.name').then(result => {
      result.forEach(item => {
        if(userGroup != item.name) {
          obj.comments = extractComments(result, item.name)
          obj.user = item.name
          newResult.push(obj)
          userGroup = item.name
        } 
        //obj.comments = comments
        console.log('object ***')
        console.log(obj)

      })
      console.log('newresult')
      console.log(newResult)
      console.log(newResult[0].comments)
      res.send(result)
    })
})

app.get('/listall', (req, res) => {
  let obj = { }
  let comments = []
  let newResult = []
  let userGroup = ''
  knex('comments')
    .join('users', 'comments.id_user', '=', 'users.id_user')
    .join('issues', 'comments.id_issue', '=', 'issues.id')
    .where('comments.body', 'like', '%present%')
    .select('comments.body', 'users.name', 'issues.title', 'comments.id_issue')
    .orderBy('users.name').then(result => {
      result.forEach(item => {
        if(userGroup != item.name) {
          //obj.comments = extractAllComments(result, item.name)
          //obj.user = item.name
          newResult.push({
            user: item.name,
            comments: extractAllComments(result, item.name)
          })
          userGroup = item.name
        } 
        //obj.comments = comments
        console.log('object ***')
        console.log(obj)

      })
      console.log('newresult')
      console.log(newResult)
      console.log(newResult[0].comments)
      res.send(newResult)
    })
})

// Search user's comments for each issue and save into database
app.post('/check/:user', (req, res) => {

  // issues = [
  //   { id: 291579075, number: 3, title: 'SE05EP01' },
  //   { id: 291579364, number: 4, title: 'SE05EP02' },
  //   { id: 291579687, number: 5, title: 'SE05EP02' }
  // ]

  let f = function(issue) {
    //console.log(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
    return api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
  }

  let urlCall = []
  

  let userComments = { 
     user: req.params.user,
     comments: [] 
  }
  //let issueUserComments = []
  let object = []
  let msg = 'user not found'
  
  console.log(issues)
  // issues.forEach(issue => {
  //   urlCall.push(() => {
  //     return api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
  //   })()
  // })
 
  Promise.all([f(issues[0]), f(issues[1]), f(issues[2]), f(issues[3]), f(issues[4]), f(issues[5]), f(issues[6]), f(issues[7])]).then(results => {
    console.log('Promise all')
    console.log(results[0])
    results.forEach((result, idx) => {
      let issueUserComments = result.data.filter(item => {
        return item.user.login === req.params.user
      })

      if (issueUserComments.length > 0) {
        issueUserComments.forEach(item => {
          item.id_issue = issues[idx].id
          item.id_user = item.user.id
          item.body = item.body
          userComments.comments.push(_.pick(item, ['id_issue', 'id_user', 'body', 'user' ]))
        })
      }

      // console.log('issueUserComments ****')
      // console.log(issueUserComments)

      // console.log('userComments ***')
      // console.log(userComments)

    })

    // persist the user and comments
    if (userComments.comments.length > 0) {
      knex('users').select().where('name', userComments.user).then(user => {
        console.log('consulta')
        console.log(user)
        // Dont' save the user if exists
        if (user.length == 0) {
          knex('users').insert({
            id_user: userComments.comments[0].user.id,
            name: userComments.comments[0].user.login,
            avatar: userComments.comments[0].user.avatar_url,
          }).then(userInserted => {
            console.log('userInserted')
            console.log(userInserted)
            let comments = []
            userComments.comments.forEach(comment => {
              let obj = _.pick(comment, ['id_issue', 'id_user', 'body'])
              comments.push(obj)
            })
            knex('comments').insert(comments).then(commentsInserted => {
              console.log('commentsInserted')
              console.log(commentsInserted)
              if(commentsInserted.length > 0) {
                console.log(commentsInserted)
                res.send({
                  msg: 'Comments inserted succesfully'
                })
              }
            })
          })
        } else {
          res.send({
            msg: 'User already saved'
          })
        }
      })  
    } else {
      res.send({
        msg: 'There is no comments'
      })
    }
    // console.log(result[0].data)
    // console.log(result[1].data)
  }).catch(err => {
    console.log(err)
  })
  //res.send({msg})
})


app.post('/check', (req, res) => {
  console.log('issues')
  console.log(issues)
  let user = req.body.user
  console.log(req.body)
  // issues = [
  //   { id: 291579075, number: 3, title: 'SE05EP01' },
  //   { id: 291579364, number: 4, title: 'SE05EP02' },
  //   { id: 291579687, number: 5, title: 'SE05EP02' }
  // ]

  let f = function(issue) {
    console.log(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
    return api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
  }

  let urlCall = []
  

  let userComments = { 
     user: user,
     comments: [] 
  }
  //let issueUserComments = []
  let object = []
  let msg = 'user not found'
  
  console.log(issues)
  // issues.forEach(issue => {
  //   urlCall.push(() => {
  //     return api.get(`/repos/sombriks/hello-js-v5/issues/${issue.number}/comments`)
  //   })()
  // })
 
  Promise.all([f(issues[0]), f(issues[1]), f(issues[2]), f(issues[3]), f(issues[4]), f(issues[5]), f(issues[6]), f(issues[7])]).then(results => {
    console.log('Promise all')
    console.log(results[0])
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

      // console.log('issueUserComments ****')
      // console.log(issueUserComments)

      // console.log('userComments ***')
      // console.log(userComments)

    })

    // persist the user and comments
    if (userComments.comments.length > 0) {
      knex('users').select().where('name', userComments.user).then(user => {
        console.log('consulta')
        console.log(user)
        // Dont' save the user if exists
        if (user.length == 0) {
          knex('users').insert({
            id_user: userComments.comments[0].user.id,
            name: userComments.comments[0].user.login,
            avatar: userComments.comments[0].user.avatar_url,
          }).then(userInserted => {
            console.log('userInserted')
            console.log(userInserted)
            let comments = []
            userComments.comments.forEach(comment => {
              let obj = _.pick(comment, ['id_issue', 'id_user', 'body'])
              comments.push(obj)
            })
            knex('comments').insert(comments).then(commentsInserted => {
              console.log('commentsInserted')
              console.log(commentsInserted)
              if(commentsInserted.length > 0) {
                console.log(commentsInserted)
                res.send({
                  msg: 'Comments inserted succesfully'
                })
              }
            })
          })
        } else {
          res.send({
            msg: 'User already saved'
          })
        }
      })  
    } else {
      res.send({
        msg: 'There is no comments'
      })
    }
    // console.log(result[0].data)
    // console.log(result[1].data)
  }).catch(err => {
    console.log(err)
  })
  //res.send({msg})
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
        console.log(`ISSUES -> ${issues}`)
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