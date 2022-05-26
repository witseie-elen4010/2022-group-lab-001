'use strict'

const dictionary = require('../models/dictionary');
const validWords = dictionary.getDictionary();

const getRandomIndexBasedOnDate = (date) => {
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    validWords.length
  );
};

const getWordOfTheDay = () => {
  const date = new Date();
  const index = getRandomIndexBasedOnDate(date);
  return validWords[index];
};

const isWordOfTheDay = (request, response) => {
  const wordOfTheDay = getWordOfTheDay();
  if (request.body.guess === wordOfTheDay) {
    response.json('word of the day')
  } else {
    response.json('not word of day')
  }
};

const wordIsValid = (request, response) => {
  const x = request.body.guess
  response.json(validWords.includes(x))
}

module.exports = {
  getWordOfTheDay,
  getRandomIndexBasedOnDate,
  wordIsValid,
  isWordOfTheDay,

};
