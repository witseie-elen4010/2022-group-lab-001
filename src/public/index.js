'use strict'

const messageContainer = document.querySelector('.messageContainer')
const keyboard = document.querySelector('.keyContainer')
let isGameEnded=false

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
// HandleEnter()
function checkCurrentRow () {
  if (currentTile > 4) {
    const currentGuess = boardArray[currentRow].join('').toLowerCase()
    const guess = { guess: currentGuess }
    // need to fetch the response to if the word is valid from backend function Ryan is creating
    // fetch(`http://localhost:8000/check/?word=${currentGuess}`)
    // .then(response => response.json())
    // .then(json => {
    const json1 = 'Valid word'
    if (json1 === 'Invalid Word') {
      feedbackForGuess('Invalid Word')
      // delete letters in the row
    } else {
      const options = {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guess)
      }
      fetch('/word', options)
        .then((res) => res.json())
        .then((wordOfTheDay) => {
          console.log(wordOfTheDay)
          if (wordOfTheDay === 'word of the day') {
            feedbackForGuess('Correct')
            isGameEnded=true
            
          } else {
            if (currentRow === 5) {
              feedbackForGuess('Try again tomorrow')
              isGameEnded=true
              return
            }

            if (currentRow < 5) {
              feedbackForGuess('Try again')
              currentRow = currentRow + 1
              currentTile = 0
            }
          }
        })
    }
    // }).catch(err => console.log(err))
  }
}
const handleClick = (letter) => {
  if(isGameEnded===false){
    if (letter === 'Backspace') {
      removeLetter()
      return
    }
    if (letter === 'Enter') {
      checkCurrentRow()
      return
    }
  addLetter(letter)}
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
    if (letter === 'Backspace' || letter === 'Enter') { handleClick(letter) } else if (letter.length===1) { handleClick(letter.toUpperCase()) }
  })
}
function feedbackForGuess (feedback) {
  const feedbackElement = document.createElement('p')
  feedbackElement.textContent = feedback
  messageContainer.append(feedbackElement)
  setTimeout(() => messageContainer.removeChild(feedbackElement), 1000)
}
generateBoard()
physicalKeyBoard()
generateKeyboard()
