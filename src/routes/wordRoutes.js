const express = require('express')
const wordController = require('../controllers/wordController')
const router = express.Router()
router.post('/', wordController.assignColours)

module.exports = router
