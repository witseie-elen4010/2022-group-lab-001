const checkCurrentRow = (
  rowsOfGuesses,
  currentRow,
  currentElement,
  wordOfTheDay
) => {
  if (currentElement === 5) {
    const currentGuess = rowsOfGuesses[currentRow].join('')
    if (currentGuess === wordOfTheDay) {
      return 'correct'
    }
  }
}

module.exports = checkCurrentRow
