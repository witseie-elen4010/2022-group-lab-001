/* eslint-env jest */

const request = require('supertest')
const express = require('express')
const bcrypt = require('bcrypt')

const loginController = require('../controllers/loginController')
const bodyParser = require('body-parser')
const router = require('../routes/loginRoutes')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

// create some mock details to be used later
// these are important for tests that care about whether the same details have been enetered twice etc
const validMockEmail1 = 'person@example.com'
const validMockPassword1 = 'password'
const validSignupDetails1 = {
  email: validMockEmail1,
  password: validMockPassword1,
  confirmPassword: validMockPassword1
}
const validLoginDetails1 = {
  email: validMockEmail1,
  password: validMockPassword1
}

// helper function to check if email exists
const emailExists = async (user, existingUsers) => {
  if (existingUsers.length === 0) return false

  const existingUser = existingUsers.find(existingUser => existingUser.email === user.email)
  if (!existingUser) return false
  return true
}

// helper function to check if user exists (both username and password match)
const userExists = async (user, existingUsers) => {
  if (!await emailExists(user, existingUsers)) return false
  const existingUser = existingUsers.find(existingUser => existingUser.email === user.email)
  return await bcrypt.compare(user.password, existingUser.password)
}

// declaring this variable here so the same one is used in the 'valid' case and the 'email already used' case

describe('When making a request to /signup', () => {
  it('should save the user\'s details and hash the password if signup details are valid', async () => {
    const response = await request(app)
      .post('/signup')
      .send(validSignupDetails1)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(200)
    const users = loginController.getUsers()
    expect(users.length).toBeGreaterThan(0)
    const user = users.find(user => user.email === validSignupDetails1.email)
    expect(user).toBeDefined()
    expect(await bcrypt.compare(validSignupDetails1.password, user.password)).toBe(true)
  })

  it('should return an http error 422 if email invalid', async () => {
    const invalidEmailSignupDetails = {
      email: 'personexample.com',
      password: 'password',
      confirmPassword: 'password'
    }
    const response = await request(app)
      .post('/signup')
      .send(invalidEmailSignupDetails)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(422)
  })

  it('should return an http error 422 if password less than 8 characters', async () => {
    const shortPasswordSignupDetails = {
      email: 'person@example.com',
      password: '7-chars',
      confirmPassword: '7-chars'
    }
    const response = await request(app)
      .post('/signup')
      .send(shortPasswordSignupDetails)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(422)
  })

  it('should return an http error code  422 if passwords do not match', async () => {
    const unmatchingPasswordSignupDetails = {
      email: 'person@example.com',
      password: 'password1',
      confirmPassword: 'password2'
    }
    const response = await request(app)
      .post('/signup')
      .send(unmatchingPasswordSignupDetails)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(422)
  })

  it('should return an http error code  409 if email already exists', async () => {
    // second addition should be invalid
    const response = await request(app)
      .post('/signup')
      .send(validSignupDetails1)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(409)
  })
})

describe('When making a request to /login', () => {
  it('should return an error if schema is incorrect', async () => {
    const invalidLoginObject = {
      email: 'person@example.com',
      password: 'password',
      confirmPassword: 'password' // confirmPassord field shouldn't be present in login
    }
    const response = await request(app)
      .post('/login')
      .send(invalidLoginObject)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400)
  })

  it('should return a success if login details are valid and in the system', async () => {
    // check if user with the login details exist. If not, create it
    const users = loginController.getUsers()

    // sign up user if they don't exist
    if (!await userExists(validLoginDetails1, users)) {
      const response = await request(app)
        .post('/signup')
        .send(validSignupDetails1)
        .set('Accept', 'application/json')
      // check user added successfully
      expect(response.statusCode).toBe(200)
    }

    const response = await request(app)
      .post('/login')
      .send(validLoginDetails1)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
  })

  it('should return an http error 403 if there is no user with that email', async () => {
    const nonExistingEmail = {
      email: 'noexist@noexist.com',
      password: 'password'
    }

    // throw error if user already exists
    const existingUsers = loginController.getUsers()
    const exists = await emailExists(nonExistingEmail, existingUsers)
    if (exists) {
      console.log('Users at email test:\n')
      existingUsers.forEach(existingUser => console.log(existingUser.email))
      throw Error('Unit test for non-existing user attempted. But user already exists')
    }

    const response = await request(app)
      .post('/login')
      .send(nonExistingEmail)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403)
  })

  it('should return an http error 403 if there is a user with that email but password doesn\'t match', async () => {
    const existingButWrongPassword = {
      email: validMockEmail1,
      password: 'incorrectpassword'
    }

    // throw error if user with that email doesn't exist
    const exists = await emailExists(existingButWrongPassword, loginController.getUsers())
    if (!exists) {
      throw Error('Unit test for existing email attempted, email does not exist!')
    }

    const response = await request(app)
      .post('/login')
      .send(existingButWrongPassword)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403)
  })
})
