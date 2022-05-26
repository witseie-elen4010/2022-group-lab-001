'use strict'

const assignColours = (request, response) => {
  const wordOfTheDay = 'train'// needs to be obtained
  const guessedWord = request.body.guessJson
  // guess.forEach(letter => { console.log(letter) })
  const colours = []
  // the order of colour assignment matters, please dont change it
  let checkWordle = wordOfTheDay
  guessedWord.forEach((letter, index) => { // first assign them all grey
    colours[index] = 'grey-block'
  })

  guessedWord.forEach((letter, index) => {
    if (letter === wordOfTheDay[index]) {
      colours[index] = 'green-block'
      checkWordle = checkWordle.replace(letter, '')// ensures we dont undo our work by removing it now its been dealth with
    }
  })

  // guess.forEach(letter => { console.log(letter) })

  guessedWord.forEach((letter, index) => {
    if (checkWordle.includes(letter)) {
      colours[index] = 'yellow-block'
      checkWordle = checkWordle.replace(letter, '')// esnures we wont check letters that have already been dealt with
    }
  })
  //  console.log('assign color called')
  // guess.forEach(letter => { console.log(letter) })
  // console.log('one', colours)
  response.json(colours)
}

module.exports = {
  assignColours
}
