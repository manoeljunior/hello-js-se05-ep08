const {knex} = require('./config')
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const axios = require('axios')
const _ = require('lodash');

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())

const api = axios.create({
  baseURL: 'https://api.github.com'
})

// Search for issues and insert into database
api.get('/repos/sombriks/hello-js-v5/issues').then(result => {
  let issues = result.data.map(item => {
    return _.pick(item, ['id', 'title', 'number'])
  })

  knex('issues').count('id as id').then(res => {
    //console.log(res)
    if (res[0].id === 0) {
      return knex('issues').insert(issues)
    }
  }).then(res => {
    if(res) console.log('Issues inserted successfully')
  })
});

knex.migrate.latest().then( _ => {
  app.listen(3000, _ => {
    console.log('Server is running...')
  });
})