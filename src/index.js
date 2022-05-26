'use strict'

const express = require('express')
const app = express() // client asks server for a file (by URL)
const serv = require('http').createServer(app)
const mWordle = require('./mWordle')
const bodyParser = require('body-parser')
const mainRouter = require('./mainRoutes.js')
const gameRouter = require('./gameRoutes.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use(express.static('node_modules'))
app.use('/cdn', express.static('public'))
app.use('/views', gameRouter)

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

const io = require('socket.io')(serv)
io.sockets.on('connection', (socket) => {
  mWordle.initGame(io, socket)
})

const port = process.env.PORT || 3000
module.exports = io
serv.listen(port)
module.exports = app
console.log('Express server running on port\n', port)
