const express = require('express')
const loginController = require('../controllers/loginController')

const router = express.Router()
router.use(express.urlencoded({ extended: false }))

router.post('/login', loginController.login)
router.post('/signup', loginController.signup)

module.exports = router
