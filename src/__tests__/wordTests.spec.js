/* eslint-env jest */
const checkCurrentRow = require("../public/scripts/wordValidation");

describe("Check row function", () => {
  test("it should check if a word in the current row equals the word of the day", () => {
    currentTile = 5;
    currentRow = 0;
    wordOfTheDay = "hello";
    const rowsOfGuesses = [
      ["h", "e", "l", "l", "o"],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    expect(
      checkCurrentRow(rowsOfGuesses, currentRow, currentTile, wordOfTheDay)
    ).toBe("correct");
  });
});

