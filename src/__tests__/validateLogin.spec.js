/* eslint-env jest */

const request = require('supertest')
const express = require('express')
const bcrypt = require('bcrypt')

const loginController = require('../controllers/loginController')
const bodyParser = require('body-parser')
const router = require('../routes/loginRoutes')

// in-memory mock database
const db = require('../testDatabase')
const User = require('../models/user')

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

// This is a setup to allow for in-memory testing of the database 
beforeAll(async () => {
  await db.setUp()
})

afterEach(async () => {
  await db.dropCollections()
})

afterAll(async () => {
  await db.dropDatabase()
})

describe('When making a request to /signup', () => {
  it('should save the user\'s details and hash the password if signup details are valid', async () => {
    const response = await request(app)
      .post('/signup')
      .send(validSignupDetails1)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(200)
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
    // first addition should return a 200
    const response1 = await request(app)
      .post('/signup')
      .send(validSignupDetails1)
      .set('Accept', 'application/json')
    expect(response1.statusCode).toBe(200)

    // second addition should return a 409
    const response2 = await request(app)
      .post('/signup')
      .send(validSignupDetails1)
      .set('Accept', 'application/json')
    expect(response2.statusCode).toBe(409)
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
    // sign up user
    const response1 = await request(app)
        .post('/signup')
        .send(validSignupDetails1)
        .set('Accept', 'application/json')
      // check user added successfully
      expect(response1.statusCode).toBe(200)

    const response2 = await request(app)
      .post('/login')
      .send(validLoginDetails1)
      .set('Accept', 'application/json')
    expect(response2.statusCode).toBe(200)
  })

  it('should return an http error 403 if there is no user with that email', async () => {
    const nonExistingEmail = {
      email: 'noexist@noexist.com',
      password: 'password'
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

    // sign up user
    const response1 = await request(app)
        .post('/signup')
        .send(validSignupDetails1)
        .set('Accept', 'application/json')
      // check user added successfully
      expect(response1.statusCode).toBe(200)
    

    const response = await request(app)
      .post('/login')
      .send(existingButWrongPassword)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(403)
  })
})
