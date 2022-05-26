const express = require('express')
const wordController = require('../controllers/wordController')
const router = express.Router()
router.post('/getColours', wordController.assignColours)
router.post('/isWordOfTheDay', wordController.isWordOfTheDay)
router.post('/wordIsValid', wordController.wordIsValid)
module.exports = router
