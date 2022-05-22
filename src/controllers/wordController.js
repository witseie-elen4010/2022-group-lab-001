'use strict';
const word = 'hello';

const getWordOfTheDay = (req, res) => {
  // choose random word depending on the day
  res.json(word)
}

module.exports = {
  getWordOfTheDay
}
