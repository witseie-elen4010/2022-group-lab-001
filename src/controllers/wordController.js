"use strict";
const dictionary = require("../models/dictionary");
const validWords = dictionary.getDictionary();

const getRandomIndexBasedOnDate = () => {
  const date = new Date();
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    validWords.length
  );
};

const getWordOfTheDay = (req, res) => {
  const index = getRandomIndexBasedOnDate();
  res.json(validWords[index]);
};

module.exports = {
  getWordOfTheDay,
};
