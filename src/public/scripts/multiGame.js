'use strict'

const wordOfTheDay = 'train'
const messageContainer = document.querySelector('.messageContainer')

const checkCurrentRow = (
  rowsOfGuesses,
  currentRow,
  currentElement,
  wordOfTheDay
) => {
  console.log(currentElement)
  if (currentElement === 5) {
    const currentGuess = rowsOfGuesses[currentRow].join('').toLowerCase()
    if (currentGuess === wordOfTheDay) {
      messageContainer.textContent = 'Correct'
    }
  }
}
// private
const tileDisplay = document.querySelector('.tileContainer1')
const tileDisplay2 = document.querySelector('.tileContainer2')

const boardArray = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]
let currentRow = 0
let currentTile = 0

// public

function generateBoard () {
  // Loop through each row and each tile to create the board
  boardArray.forEach((boardRow, boardRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'boardRow-' + boardRowIndex)
    boardRow.forEach((tile, tileIndex) => {
      const tileElement = document.createElement('div')
      tileElement.setAttribute(
        'id',
        'boardRow-' + boardRowIndex + '-tile-' + tileIndex
      )
      tileElement.classList.add('tile')
      rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
  })
}

function generateBoard2 () {
  // Loop through each row and each tile to create the board
  boardArray.forEach((boardRow, boardRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'boardRow-' + boardRowIndex)
    boardRow.forEach((tile, tileIndex) => {
      const tileElement = document.createElement('div')
      tileElement.setAttribute(
        'id',
        'boardRow-' + boardRowIndex + '-tile-' + tileIndex
      )
      tileElement.classList.add('tile')
      rowElement.append(tileElement)
    })
    tileDisplay2.append(rowElement)
  })
}
function getCurrentPosition (previousRow, previousTile) {
  // for future functionality this must deal with the logic for deleting and element and for moving to the next row
  previousTile++
  return { previousRow, previousTile }
}

function addLetter (letter) {
  const previousRow = currentRow
  const previousTile = currentTile
  // to ensure we only enter 5 letters in one row
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      'boardRow-' + currentRow + '-tile-' + currentTile
    )
    tile.textContent = letter
    boardArray[currentRow][currentTile] = letter
    console.log('boardRow', boardArray)
    const position = getCurrentPosition(previousRow, previousTile)

    currentRow = position.previousRow
    currentTile = position.previousTile
  }
}

function removeLetter () {
  if (currentTile > 0) {
    currentTile--
    const tile = document.getElementById('boardRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = ''
    boardArray[currentRow][currentTile] = ''
  }
}

generateBoard()
generateBoard2()

// function physicalKeyBoard () {
// letter input from keyboard, later should be updated to work with on screen keyboard-just used to visually check its working
document.addEventListener('keypress', (event) => {
  const letter = event.key
  console.log(event.code)
  addLetter(letter)
})
// }
// physicalKeyBoard()
const keyboard = document.querySelector('.keyContainer')

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Enter',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'Backspace'
]

const handleClick = (letter) => {
  if (letter === 'Backspace') {
    removeLetter()
    return
  }
  addLetter(letter)
  if (letter === 'Enter') {
    console.log(letter)
    checkCurrentRow(boardArray, currentRow, currentTile, wordOfTheDay)
  }
}
function generateKeyboard () {
  keys.forEach((key) => {
    const buttonTag = document.createElement('button')
    buttonTag.textContent = key
    buttonTag.setAttribute('id', key)
    console.log(key)
    buttonTag.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonTag)
  })
}

generateKeyboard()
