"use strict";
const dictionary = require("../models/dictionary");
const validWords = dictionary.getDictionary();

const getRandomIndexBasedOnDate = (date) => {
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    validWords.length
  );
};

const getWordOfTheDay = (req, res) => {
  const date = new Date();
  const index = getRandomIndexBasedOnDate(date);
  res.json(validWords[index]);
};

module.exports = {
  getWordOfTheDay,
  getRandomIndexBasedOnDate,
};
