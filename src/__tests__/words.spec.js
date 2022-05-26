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
test('the word of the day is train, it should return green,green,green,green,green which corresponds to the class used in css to change its appearance', async () => {
  let wordOfTheDay = wordController.getWordOfTheDay()
  const splitWord=wordOfTheDay.split('');
  const body = { guessJson: splitWord }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'green-block'])
})

test('the word of the day is train, it should return green,green,green,grey which corresponds to the class used in css to change its appearance', async () => {
  let wordOfTheDay = wordController.getWordOfTheDay()
  const splitWord=wordOfTheDay.split('');
  splitWord[splitWord.length - 1] ='q'
  const body = { guessJson: splitWord }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'grey-block'])
})

test('the word of the day is train, it should return blue,green,green,blue which corresponds to the class used in css to change its appearance', async () => {
  let wordOfTheDay = wordController.getWordOfTheDay()
  const splitWord=wordOfTheDay.split('');
  let temp=splitWord[splitWord.length - 1]
  splitWord[splitWord.length - 1]=splitWord[0]
  splitWord[0]=temp

  const body = { guessJson: splitWord }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['blue-block', 'green-block', 'green-block', 'green-block', 'blue-block'])
})
