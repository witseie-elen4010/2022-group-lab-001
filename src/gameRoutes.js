'use strict'

const path = require('path')

const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

router.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'))
})
router.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
router.get('/singlePlayer', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'singlePlayer.html'))
})

router.get('/multiPlayer', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'multiPlayer.html'))
})

module.exports = router
