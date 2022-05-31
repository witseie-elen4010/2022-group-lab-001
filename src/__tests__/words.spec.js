/* eslint-env jest */

const dictionary = require('../models/dictionary')
const validWords = dictionary.getDictionary()
const request = require('supertest')
const wordController = require('../controllers/wordController')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const router = require('../routes/wordRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)
test('the word of the day is train, it should return green,green,green,green,green which corresponds to the class used in css to change its appearance', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'green-block'])
})

test('the word of the day is train, it should return green,green,green,grey which corresponds to the class used in css to change its appearance', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  splitWord[splitWord.length - 1] = 'q'
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'grey-block'])
})

test('the word of the day is train, it should return blue,green,green,blue which corresponds to the class used in css to change its appearance', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  const temp = splitWord[splitWord.length - 1]
  splitWord[splitWord.length - 1] = splitWord[0]
  splitWord[0] = temp
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['blue-block', 'green-block', 'green-block', 'green-block', 'blue-block'])
})

describe('When making a request to /word', () => {
  it('should return a valid word for the day', async () => {
    const word = wordController.getWordOfTheDay()
    expect(word.length).toBe(5)
    expect(validWords.includes(word)).toBe(true)
  })
})

test('Testing post request to check if a word is equal to the word of the day the response is correct', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay()
  const body = { guess: wordOfTheDay, chosen: '' }
  const response = await request(app).post('/isWordOfTheDay').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toBe('word of the day')
})

describe('When making a request to /wordIsValid', () => {
  it('Tests if a valid word sent to /wordIsValid returns true', async () => {
    const validWord = validWords[8]
    const body = { guess: validWord }
    const response = await request(app).post('/wordIsValid').send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe(true)
  })

  it('Tests if an invalid word sent to /wordIsValid returns false', async () => {
    const body = { guess: 'zz' }
    const response = await request(app).post('/wordIsValid').send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe(false)
  })
})

test('Tests whether a new index is generated per day', () => {
  const date1 = new Date()
  const date2 = new Date()
  date1.setFullYear(2022, 4, 2)
  date2.setFullYear(2022, 4, 3)
  index1 = wordController.getRandomIndexBasedOnDate(date1)
  index2 = wordController.getRandomIndexBasedOnDate(date2)
  expect(index1).not.toBe(index2)
})
