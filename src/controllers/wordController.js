'use strict'

const assignColours = (request, response) => {
  const wordOfTheDay = 'train'// needs to be obtained
 
  const guessedWord = request.body.guessJson
  const colours = []
  console.log(guessedWord)
  // the order of colour assignment matters, please dont change it
   let checkWordle = getWordOfTheDay()
   guessedWord.forEach((letter, index) => { // first assign them all grey
     colours[index] = 'grey-block'
   })

  guessedWord.forEach((letter, index) => {
    if (letter === wordOfTheDay[index]) {
      colours[index] = 'green-block'
      checkWordle = checkWordle.replace(letter, '')// ensures we dont undo our work by removing it now its been dealth with
    }
  })

  guessedWord.forEach((letter, index) => {
    if (checkWordle.includes(letter)) {
      colours[index] = 'blue-block'
      checkWordle = checkWordle.replace(letter, '')// esnures we wont check letters that have already been dealt with
    }
  })

  response.json(colours)

}
const getWordOfTheDay = () => {
  return 'train'

}

module.exports = {
  assignColours,
  getWordOfTheDay
}
