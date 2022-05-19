'use strict'

const path = require('path')
const validateLogin = require('validateLogin')

const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
router.get('/singlePlayer', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'singlePlayer.html'))
})

router.get('/multiPlayer', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'multiPlayer.html'))
})

router.post('/api/create', function (req, res) {
  const validLogins = [
    {
      username: 'admin',
      password: 'user'
    },
    {
      username: 'someone',
      password: 'password'
    }
  ]
  if (validateLogin(req.username, req.password, validLogins)) {
    console.log('Login successful')
    res.redirect(req.baseUrl + '/views/multiplayer.html')
  }
})

module.exports = router
