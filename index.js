'use strict'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mainRouter = require('./mainRoutes.js')
// tell Express to use bodyParser for JSON and URL encoded form bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
