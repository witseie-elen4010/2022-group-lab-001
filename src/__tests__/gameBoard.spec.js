'use strict'

// This will be later used to add additional logic to the gameboard such as backspace and colouring the tiles
/* eslint-env jest */
const getCurrentPosition = require('../public/gameLogic')
describe('Check position of next free tile is correct', () => {
  test('Add a letter', () => {
    const currentRow = 0
    const currentTile = 0
    const position = getCurrentPosition(currentRow, currentTile)
    expect(position.previousRow).toBe(0)
    expect(position.previousTile).toBe(1)
  })
})
