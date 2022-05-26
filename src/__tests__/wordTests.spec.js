/* eslint-env jest */
const checkCurrentRow = require('../public/scripts/wordValidation')
const wordController = require('../controllers/wordController')
describe('Check row function', () => {
  test('it should check if a word in the current row equals the word of the day', () => {
    const currentElement = 5
    let currentRow = 0
    const wordOfTheDay = 'hello'
    const rowsOfGuesses = [
      ['h', 'e', 'l', 'l', 'o'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['h', 'e', 'l', 'l', 'o'],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ]
    expect(
      checkCurrentRow(rowsOfGuesses, currentRow, currentElement, wordOfTheDay)
    ).toBe('correct')

    currentRow = 3
    expect(
      checkCurrentRow(rowsOfGuesses, currentRow, currentElement, wordOfTheDay)
    ).toBe('correct')
  })
})

