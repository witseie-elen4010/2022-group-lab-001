/* eslint-env jest */
const request = require("supertest")
const wordController = require("../controllers/wordController")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const router = require("../routes/wordRoutes");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/", router)

const dictionary = require("../models/dictionary")
const validWords = dictionary.getDictionary();

describe('When making a request to /word', () => {
  it('should return a valid word for the day', async () => {
    const word=wordController.getWordOfTheDay()
    expect(word.length).toBe(5)
    expect(validWords.includes(word)).toBe(true)
  })
})

test("Testing post request to check if a word is equal to the word of the day the response is correct", async () => {
  const wordOfTheDay = wordController.getWordOfTheDay()
  const body = { guess: wordOfTheDay };
  const response = await request(app).post("/").send(body)
  expect(response.statusCode).toBe(200)
  expect(response.body).toBe('word of the day')
})

test("Tests whether a new index is generated per day", () => {
  const date1 = new Date()
  const date2 = new Date()
  date1.setFullYear(2022, 4, 2)
  date2.setFullYear(2022, 4, 3)
  index1 = wordController.getRandomIndexBasedOnDate(date1)
  index2 = wordController.getRandomIndexBasedOnDate(date2)
  expect(index1).not.toBe(index2)
})
