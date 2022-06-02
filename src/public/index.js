'use strict'

const messageContainer = document.querySelector('.messageContainer')
const keyboard = document.querySelector('.keyContainer')
const logModal = document.querySelector('.logs')

let isGameEnded = false
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

async function logActions(action) {
  console.log(action)
  const options = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(action)
  }
  // console.log(options)
  // async function logIt('/actions/addAction'){
  const response = await fetch('/actions/addAction', options)
  console.log(response)
  //  return response
}

function generateBoard() {
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
function getCurrentPosition(previousRow, previousTile) {
  // for future functionality this must deal with the logic for deleting and element and for moving to the next row
  previousTile++
  return { previousRow, previousTile }
}

function addLetter(letter) {
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

    tile.setAttribute('data', letter)
    const position = getCurrentPosition(previousRow, previousTile)

    currentRow = position.previousRow
    currentTile = position.previousTile
  }
}

function removeLetter() {
  if (currentTile > 0) {
    currentTile--
    const tile = document.getElementById('boardRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = ''
    boardArray[currentRow][currentTile] = ''
  }
}

async function wordIsValid(guess) {
  const options = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(guess)
  }
  const response = await fetch('/word/wordIsValid', options)
  const isValid = await response.json()

  return isValid
}

const requestFeedback = async () => {
  const currentTiles = document.querySelector('#boardRow-' + currentRow).childNodes
  const guessedWord = []
  currentTiles.forEach(tile => {
    guessedWord.push(tile.getAttribute('data'))
  })
  const guessJson = { guessJson: guessedWord, chosen: '' }
  const options = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(guessJson)
  }

  const response = await fetch('/word/getColours', options)
  const colours = await response.json()
  return colours
}

function revealFeedback(colours, feedbackRow) {
  const currentTiles = document.querySelector('#boardRow-' + feedbackRow).childNodes
  currentTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip') // (causes flip animation)
      tile.classList.add(colours[index])// asign each tile to the approriate colour class to change its colour
      // colour the keyboard
      const key = document.getElementById(tile.getAttribute('data'))// asign each key to the approriate colour class.
      // The colour matches the tile's colour
      key.classList.add(colours[index])
    }, 300 * index)// ensure they dont all flip and change colour  at the same time, Higher indexes executed after more time
  })
}

 function checkCurrentRow() {
  if (currentTile > 4) {
    const currentGuess = boardArray[currentRow].join('').toLowerCase()

    const guess = { guess: currentGuess, chosen: '' }
    wordIsValid(guess).then(isValid => {
      const currentDate = new Date()
      logActions({
        guess: currentGuess, typeOfAction: 'guess', initiatedBy: 'player', timeStamp: currentDate.toLocaleString()
      })
      if (!isValid) {
        feedbackForGuess('Invalid Word')
        // delete letters in the row
      } else {
        const currentDate = new Date()
        logActions({
          guess: currentGuess, typeOfAction: 'guess', initiatedBy: 'player', timeStamp: currentDate.toLocaleString()
        })
        console.log('word is valid')
        const feedbackRow = currentRow// prevents row from changing before callback called
        requestFeedback().then((colours) => revealFeedback(colours, feedbackRow))
        const options = {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(guess)
        }
        fetch('/word/isWordOfTheDay', options)
          .then((res) => res.json())
          .then((wordOfTheDay) => {
            console.log(wordOfTheDay)
            if (wordOfTheDay === 'word of the day') {
              feedbackForGuess('Correct')
              let feedbackRow = currentRow//prevents row from changing before callback called
              requestFeedback().then((colours) => revealFeedback(colours, feedbackRow))
              isGameEnded = true
            } else {
              if (currentRow === 5) {
                console.log('current row = 5')

                feedbackForGuess('Try again tomorrow')
                let feedbackRow = currentRow//prevents row from changing before callback called
                requestFeedback().then((colours) => revealFeedback(colours, feedbackRow))
                fetch('/word/revealWord')
                  .then((response) => response.json())
                  .then((data) => (messageContainer.append('Try again tomorrow :) !!! Today\'s word was: ', data.toUpperCase())))

                isGameEnded = true
                return
              }

              if (currentRow < 5) {
                feedbackForGuess('Try again')
                let feedbackRow = currentRow//prevents row from changing before callback called
                requestFeedback().then((colours) => revealFeedback(colours, feedbackRow))
                currentRow = currentRow + 1
                currentTile = 0
              }
            }
          })
      }
    })
  }
}
const handleClick = (letter) => {
  if (isGameEnded === false) {
    if (letter === 'Backspace') {
      removeLetter()
      return
    }
    if (letter === 'Enter') {
      checkCurrentRow()

      return
    }
    addLetter(letter)
  }
}
function activateOnscreenKeyBoard() {
  keys.forEach((key) => {
    const buttonTag = document.createElement('button')
    buttonTag.textContent = key
    buttonTag.setAttribute('id', key)
    console.log(key)
    buttonTag.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonTag)
  })
}

function activatePhysicalKeyBoard() {
  document.addEventListener('keydown', (event) => {
    const letter = event.key
    if (letter === 'Backspace' || letter === 'Enter') { handleClick(letter) } else if (letter.length === 1) { handleClick(letter.toUpperCase()) }
  })
}
function feedbackForGuess(feedback) {
  const feedbackElement = document.createElement('p')
  feedbackElement.textContent = feedback
  messageContainer.append(feedbackElement)
  setTimeout(() => messageContainer.removeChild(feedbackElement), 3000)
}
function viewLogs() {
  logModal.innerHTML = ''
  const logView = document.createElement('div')
  logModal.append(logView)
  fetch('/actions/allActions').then((response) => {
    if (response.ok) {
      return response.json()
    } // Return the response parse as JSON
    else { throw 'Failed to load classlist: response code invalid!' }
  }).then(data => {
    data.forEach(element => {
      const logDiv = document.createElement('div')
      logDiv.className = 'log-div'
      const guessPar = document.createElement('p')
      guessPar.textContent = `Guess: ${element.guess}`
      const actionPar = document.createElement('p')
      actionPar.textContent = `Action: ${element.typeOfAction}`
      const initiatedByPar = document.createElement('p')
      initiatedByPar.textContent = `Initiated By: ${element.initiatedBy}`
      const createdAtPar = document.createElement('p')
      createdAtPar.textContent = `Created at : ${element.timeStamp}`
      logDiv.append(guessPar)
      logDiv.append(actionPar)
      logDiv.append(initiatedByPar)
      logDiv.append(createdAtPar)
      logView.append(logDiv)
    })
  })
}

viewLogs()
generateBoard()

activatePhysicalKeyBoard()
activateOnscreenKeyBoard()