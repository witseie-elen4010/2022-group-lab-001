const express = require('express')
const router = express.Router()
const Action = require('../models/actions')

router.post('/addAction', (req, res) => {
    const action = new Action(req.body)
    action.save()
    res.send(action)
})

router.get('/allActions', (req, res) => {
    Action.find().then((result) => {
        res.send(result)
    }).catch((error) => console.log(error))
})

module.exports = router

