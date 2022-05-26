'use strict'

const Joi = require('joi')
const bcrypt = require('bcrypt')

// TODO: add passport (next sprint)
// const passport = require('passport')
// const initialisePassport = require('./passport-config')
// const flash = require('express-flash')
// const session = require('express-session')

const users = []

// initialisePassport(
//   passport,
//   email => logins.find(user => user.email === email)
// )

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

    const login = users.find(lgn => lgn.email === req.body.email)
    if (!login) {
      res.status(403).send('Invalid username or password')
      return false
    }

    // validate password
    if (!await bcrypt.compare(req.body.password, login.password)) {
      res.status(403).send('Invalid username or password')
      return false
    }

    // happy case
    res.status(200).send('Login successful')
    return true
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

  // check email not already used
  const existingUser = users?.find(user => user.email === req.body.email)
  if (existingUser) {
    res.status(409).send('Email already used')
    return
  }

  // happy case
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now.toString(),
      email: req.body.email,
      password: hashedPassword
    })
    console.log(users)
    res.status(200).send('Account created successfully')
  } catch {
    res.status(500).send('Something went wrong')
  }
}

const getUsers = () => users

module.exports.login = login
module.exports.signup = signup
// temporary export for unit testing. To be removed when persistant storage is used
module.exports.getUsers = getUsers
