'use strict'

const Joi = require('joi')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const users = []

const login = async (req, res) => {
  try {
    // validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).send(error.details[0].message)
      return false
    }

    User.findOne({
      email: req.body.email
    })
      .exec((err, user) => {
        if (err) {
          res.status(500).send(err)
          return false
        }
        if (!user) {
          // no user with that email found
          res.status(403).send('Invalid username or password')
          return false
        }
        // validate password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.status(403).send('Invalid username or password')
          return false
        }
        // happy case
        res.status(200).send('Login successful')
        return true
      })
  } catch {
    res.redirect('/login')
  }
}

const signup = async (req, res) => {
  // validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required()
  })
  const { error } = schema.validate(req.body)
  if (error) {
    res.status(422).send(error.details[0].message)
    return
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.status(422).send('Passwords do not match')
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    })
    user.save()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        console.log(err)
        if (err.code === 11000) {
          // Duplicate email
          res.status(409).send('A user with that email already exists!')
        }
      })
  } catch {
    res.status(500).send('Something went wrong')
  }
}

module.exports.login = login
module.exports.signup = signup
