const {knex} = require('./config')
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())


knex.migrate.latest().then( _ => {
  app.listen(3000, _ => {
    console.log('Server is running...')
  })
})