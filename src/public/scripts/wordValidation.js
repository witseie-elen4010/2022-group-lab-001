const checkCurrentRow = (
  rowsOfGuesses,
  currentRow,
  currentTile,
  wordOfTheDay
) => {
  if (currentTile === 5) {
    const currentGuess = rowsOfGuesses[currentRow].join("");
    if (currentGuess === wordOfTheDay) {
      return "correct";
    }
  }
};

module.exports = checkCurrentRow;
