/* eslint-env jest */
const request = require('supertest')
const wordController = require('../controllers/wordController')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const router = require('../routes/wordRoutes');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)
test('the word of the day is train, it should return grey,green,green,green which corresponds to the class used in css to change its appearance', async () => {
  let wordOfTheDay = wordController.getWordOfTheDay()
  wordOfTheDay=['t','r','a','i','n']
  const body = { guessJson: wordOfTheDay }
  const response = await request(app).post('/').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'green-block'])
})

/* describe('Testing colour assignment', function () {
    test('the word of the day is train, it should return grey,green,green,green which corresponds to the class used in css to change its appearance', () => {
      const guess = 'brain'
      expect(wordController.assignColours(guess)).toEqual(['grey-overlay', 'green-overlay', 'green-overlay', 'green-overlay', 'green-overlay'])
    })
  }) */
