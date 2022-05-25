'use strict'

const isWordOfTheDay = (request, response) => {
  const wordOfTheDay = 'train'
  if (request.body.guess === wordOfTheDay) { response.json('word of the day') } else { response.json('not word of day') }
  console.log(request.body)
}

module.exports = {
  isWordOfTheDay
}
