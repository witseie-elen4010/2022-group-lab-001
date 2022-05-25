'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mainRouter = require('./mainRoutes.js')
const gameRouter = require('./gameRoutes.js')
const loginController = require('./controllers/loginController')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))
app.use('/views', gameRouter)
app.use('/loginapi', loginController)

// module.exports(app)

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port\n', port)
