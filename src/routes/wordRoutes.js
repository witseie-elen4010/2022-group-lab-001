const express = require('express')
const wordController = require('../controllers/wordController')
const router = express.Router()
router.post('/', wordController.isWordOfTheDay)

module.exports = router
