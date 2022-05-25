'use strict'

const Joi = require('joi')
const express = require('express')
const bcrypt = require('bcrypt')
// const passport = require('passport')
// const initialisePassport = require('./passport-config')
// const flash = require('express-flash')
// const session = require('express-session')

const router = express.Router()

router.use(express.urlencoded({ extended: false }))

const users = []

// initialisePassport(
//   passport,
//   email => logins.find(user => user.email === email)
// )

const loginFn = async (req, res) => {
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
    // res.redirect(req.url + '../../views/index')
    return true
  } catch {
    res.redirect('/login')
  }
}

router.post('/login', loginFn)
// (req, res) => {
//   // validation
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(8).required()
//   })
//   const { error } = schema.validate(req.body)
//   if (error) {
//     res.status(400).send(error.details[0].message)
//     return
//   }

//   const login = logins.find(lgn => lgn.email === req.body.email && lgn.password === req.body.password)
//   if (!login) {
//     res.status(404).send('Invalid username or password')
//   }

//   // happy case
//   res.status(200).send('Login successful')
// })

router.post('/signup', async (req, res) => {
  // validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required()
  })
  const { error } = schema.validate(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).send('Passwords do not match')
    return
  }

  // check email not already used
  const existingUser = users?.find(user => user.email === req.body.email)
  if (existingUser) {
    res.status(200).send('Email already used')
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
    res.redirect('/')
  } catch {
    res.redirect('/signup')
  }

  // req.status(200).send('Account created successfully')
})

// function login (username, password, validLogins) {
//   let found = false
//   validLogins.every(validLogin => {
//     if (username === validLogin.username && password === validLogin.password) {
//       found = true
//       // break out of loop
//       return false
//     }
//     // if login doesn't match, iterate
//     return true
//   })
//   if (found) {
//     // login successful
//     return true
//   } else {
//     return false
//   }
// }

// function signup (signupDetails) {
//   // validation

//   if (error) {
//     return false
//   }
//   if (password.length < 8) {
//     return false
//   }
//   if (password === email) {
//     return false
//   }
//   if (password !== confirmPassword) {
//     return false
//   }

//   // happy case
//   console.log(`Successfully logged in as ${email}`)
//   return true
// }

// module.exports.login = login
// module.exports.signup = signup
module.exports = router
