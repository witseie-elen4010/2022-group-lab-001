'use strict'

const dictionary = require('../models/dictionary')
const validWords = dictionary.getDictionary()

const getRandomIndexBasedOnDate = (date) => {
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    validWords.length
  )
}

const getWordOfTheDay = () => {
  const date = new Date()
  const index = getRandomIndexBasedOnDate(date)
  return (validWords[index])
}

const isWordOfTheDay = (request, response) => {
  const wordOfTheDay = getWordOfTheDay()
  console.log(wordOfTheDay)
  if (request.body.guess === wordOfTheDay) { response.json('word of the day') } else { response.json('not word of day') }
  console.log(request.body)
}

module.exports = {
  getWordOfTheDay,
  getRandomIndexBasedOnDate,
  isWordOfTheDay
}
