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

test('the colours are corrent when the word guessed matches the correct word', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'green-block'])
})

test('the colours are correct when the first 4 letters in the guessed word matches the correct word but last letter  isnt present in the word at all', async () => {
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  splitWord[splitWord.length - 1] = 'q'
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['green-block', 'green-block', 'green-block', 'green-block', 'grey-block'])
})

test('the colors are correct when the word guessed contains all the letters in the guessed word but the first and second letter which are swapped', async () => {
 
  const wordOfTheDay = wordController.getWordOfTheDay().toUpperCase()
  const splitWord = wordOfTheDay.split('')
  const temp = splitWord[1]
  splitWord[1] = splitWord[0]
  splitWord[0] = temp
  const body = { guessJson: splitWord, chosen: '' }
  const response = await request(app).post('/getColours').send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toStrictEqual(['blue-block', 'blue-block', 'green-block', 'green-block', 'green-block'])
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
