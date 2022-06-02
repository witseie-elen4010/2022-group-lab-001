'use strict'

const dictionary = require('../models/dictionary')
const validWords = dictionary.getDictionary()

const assignColours = (request, response) => {
  // const wordOfTheDay = 'train'// needs to be obtained
  let wordOfTheDay = getWordOfTheDay().toUpperCase()

  const guessedWord = request.body.guessJson
  if (request.body.chosen.length !== 0) {
    wordOfTheDay = request.body.chosen.toUpperCase()
  }
  const colours = []
  console.log(guessedWord)
  // the order of colour assignment matters, please dont change it
  let checkWordle = wordOfTheDay
  guessedWord.forEach((letter, index) => { // first assign them all grey
    colours[index] = 'grey-block'
  })
 guessedWord.forEach((letter, index) => {
    if (checkWordle.includes(letter)) {
      colours[index] = 'blue-block'
    }
  })
  guessedWord.forEach((letter, index) => {
    if (letter === wordOfTheDay[index]) {
      colours[index] = 'green-block'
      checkWordle = checkWordle.replace(letter, '')// ensures we dont undo our work by removing it now its been dealth with
    }
  })

 

  response.json(colours)
}

const getRandomIndexBasedOnDate = (date) => {
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    validWords.length
  )
}

const getWordOfTheDay = () => {
  const date = new Date()
  const index = getRandomIndexBasedOnDate(date)
  return validWords[index]
}

const isWordOfTheDay = (request, response) => {
  let wordOfTheDay = getWordOfTheDay()
  if (request.body.chosen.length !== 0) {
    wordOfTheDay = request.body.chosen.toUpperCase()
  }
  if (request.body.guess === wordOfTheDay || request.body.guess.toUpperCase() === wordOfTheDay) {
    response.json('word of the day')
  } else {
    response.json('not word of day')
  }
}

const wordIsValid = (request, response) => {
  const currentGuess = request.body.guess
  response.json(validWords.includes(currentGuess))
}

const revealWord=(request, response)=>{
  response.json(getWordOfTheDay())
}

module.exports = {
  getWordOfTheDay,
  getRandomIndexBasedOnDate,
  wordIsValid,
  isWordOfTheDay,
  assignColours,
  revealWord

}
