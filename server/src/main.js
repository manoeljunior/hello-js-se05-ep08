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
  issues.forEach(issue => {
    if (issue.title.includes('SE05EP')) {
      // to call each issue and search for user's comments
    }
  })
  //res.send(issues)
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