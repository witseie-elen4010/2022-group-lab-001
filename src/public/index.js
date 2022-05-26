'use strict'

const wordOfTheDay = 'train'
const messageContainer = document.querySelector('.messageContainer')
const keyboard = document.querySelector('.keyContainer')

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
const tileDisplay = document.querySelector('.tileContainer')
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

const handleClick = (letter) => {
  if (letter === 'Backspace') {
    removeLetter()
    return
  }
  if (letter === 'Enter') {
    checkCurrentRow(boardArray, currentRow, currentTile, wordOfTheDay)
    return
  }
  addLetter(letter)
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
function physicalKeyBoard () {
// letter input from keyboard, later should be updated to work with on screen keyboard-just used to visually check its working
  document.addEventListener('keydown', (event) => {
    const letter = event.key
    handleClick(letter)
    console.log('this is back', event)
  })
}
generateBoard()
physicalKeyBoard()
generateKeyboard()
