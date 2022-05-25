'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mainRouter = require('./mainRoutes.js')
const gameRouter = require('./gameRoutes.js')
const wordRouter = require('./routes/wordRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '1mb' }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))
app.use('/views', gameRouter)
app.use('/word', wordRouter, express.static('public'), express.json({ limit: '1mb' }))

// module.exports(app)

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port\n', port)
