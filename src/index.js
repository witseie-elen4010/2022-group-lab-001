'use strict'

const express = require('express')
const app = express() // client asks server for a file (by URL)
const serv = require('http').Server(app)
// const fs = require('fs')

const bodyParser = require('body-parser')
const mainRouter = require('./mainRoutes.js')
const gameRouter = require('./gameRoutes.js')
const loginController = require('./routes/loginRoutes')

const wordRouter = require('./routes/wordRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.json({ limit: '1mb' }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))
app.use('/views', gameRouter)
app.use('/loginapi', loginController)
app.use('/word', wordRouter, express.static('public'), express.json({ limit: '1mb' }))

// module.exports(app)
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

const port = process.env.PORT || 3000
serv.listen(port)
// app.listen(port)
// const x = require('./config/socket.js')(serv)

module.exports = app
console.log('Express server running on port\n', port)
