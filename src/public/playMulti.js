'use strict'

const IO = {

  init: function () {
    IO.socket = io.connect()
    IO.bindEvents()
  },

  bindEvents: function () {
    IO.socket.on('connected', IO.onConnected)
    IO.socket.on('gameCreated', IO.onNewGameCreated)
    IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom)
    IO.socket.on('beginGame', IO.beginGame)
    IO.socket.on('beginGame3', IO.beginGame3)
    IO.socket.on('newWordData', IO.onNewWordData)
    IO.socket.on('winner', IO.othersKnowIfYouWon)
  },

  onConnected: function () {
    // Cache a copy of the client's socket.IO session ID on the App
    // in future will have to link to database to store name, points etc
    App.mySocketId = IO.socket.id
  },

  onNewGameCreated: function (data) {
    App.Host.gameInit(data)
  },
  playerJoinedRoom: function (data) {
    App[App.myRole].updateWaitingScreen(data)
  },

  beginGame: function (data) {
    App[App.myRole].displayGame(data)
  },

  beginGame3: function (data) {
    chosenWord = data.newWord
    console.log('beginGame3 word:' + chosenWord)
    if (App.myRole === 'Player') {
      App.Player.displayGame(data)
    }
    if (App.myRole === 'Host') {
      App.Host.displayGame3(data)
    }
  },
  onNewWordData: function (data) {
    App[App.myRole].newWord(data)
  },
  othersKnowIfYouWon: function (data) {
    App[App.myRole].declareWinner(data)
  }

}

const App = {
  gameId: 0,
  myRole: '', // 'Player' or 'Host'
  mySocketId: '',
  currentRound: 0,
  players2: false,
  players3: false,
  hostWord: '',

  init: function () {
    App.cacheElements()
    App.showInitScreen()
    App.bindEvents()
  },

  cacheElements: function () {
    // Templates
    App.gameArea = document.getElementById('gameArea')
    App.templateIntroScreen = document.getElementById('intro-screen-template').innerHTML
    App.templateNewGame = document.getElementById('create-game-template').innerHTML
    App.templateJoinGame = document.getElementById('join-game-template').innerHTML
    App.observerScreen = document.getElementById('host-3-template').innerHTML
    App.waitingScreen = document.getElementById('waiting-screen').innerHTML
    App.hostGame = document.getElementById('host-game-template').innerHTML
    App.playerGame = document.getElementById('host-game-template').innerHTML
  },

  showInitScreen: function () {
    App.gameArea.innerHTML = App.templateIntroScreen
  },

  bindEvents: function () {
    document.getElementById('btnCreateGame2').onclick = function () {
      App.Host.onCreateClick()
    }
    document.getElementById('btnCreateGame3').onclick = function () {
      App.players3 = true
      App.hostWord = document.getElementById('hostWord').value
      chosenWord = App.hostWord
      console.log('chosen word:' + chosenWord)
      App.Host.onCreateClick()
    }
    document.getElementById('btnJoinGame').onclick = function () {
      document.getElementById('btnStart').style.display = 'block'
      App.Player.onJoinClick()
    }
    document.getElementById('btnStart').onclick = function () {
      console.log('start clcked')
      App.Player.onPlayerStartClick()
    }
  },

  Host: {

    players: [],
    isNewGame: false,
    numPlayersInRoom: 0,
    currentCorrectAnswer: '',

    onCreateClick: function () {
      console.log('clicked "create"')
      chosenWord = document.getElementById('hostWord').value
      console.log('host word = ' + App.hostWord)
      IO.socket.emit('hostCreateNewGame')
    },

    gameInit: function (data) {
      App.gameId = data.gameId
      App.mySocketId = data.mySocketId
      App.myRole = 'Host'
      App.Host.numPlayersInRoom = 0
      // App.hostWord = ' '
      App.Host.displayNewGameScreen()
    },

    displayNewGameScreen: function () {
      // Fill the game screen with the appropriate HTML
      // Show the gameId / room id on screen
      App.gameArea.innerHTML = App.templateNewGame
      document.getElementById('spanNewGameCode').innerText = App.gameId
    },

    // for multiple players
    updateWaitingScreen: function (data) {
      // If this is a restarted game, show the screen.
      App.gameArea.innerHTML = App.waitingScreen
      if (App.Host.isNewGame) {
        App.Host.displayNewGameScreen()
      }
      App.Host.players.push(data)

      // Increment the number of players in the room
      App.Host.numPlayersInRoom += 1

      console.log(App.players3)
      let numPlayers = 1
      if (App.players2 === true) {
        numPlayers = 1
      } else if (App.players3 === true) {
        numPlayers = 2
      }
      // If one player(s) have joined, start the game!
      // change using if statements based on user input
      if (App.Host.numPlayersInRoom === numPlayers) {
        // Let the server know that players are present.
        if (App.players3) {
          IO.socket.emit('hostRoomFull3', { gameId: App.gameId, newWord: chosenWord })
        } else {
          IO.socket.emit('hostRoomFull', App.gameId)
        }
      }
    },

    declareWinner: function (data) {
      console.log('Winner2 is' + data.myRole)
      const messageContainer = document.querySelector('.messageContainer')
      const text = data.myRole + ' Won!'
      messageContainer.append(text)
    },

    displayGame3: function () {
      App.gameArea.innerHTML = App.observerScreen
    },

    displayGame: function () {
      // Prepare the game screen with new HTML
      App.gameArea.innerHTML = App.hostGame
      IO.socket.emit('tellHostGameStarting', App.gameId)
      // let isGameEnded = false

      /* let wordOfTheDay = 'train'
      const hostWord = chosenWord
      if (hostWord.length === 5) {
        wordOfTheDay = hostWord
      }
      */
      // const messageContainer = document.querySelector('.messageContainer')
      // const isGameEnded = false

      /* const checkCurrentRow = (
        rowsOfGuesses,
        currentRow,
        currentElement,
        wordOfTheDay
      ) => {
        console.log(currentElement)
        if (currentElement === 5) {
          const currentGuess = rowsOfGuesses[currentRow].join('').toLowerCase()
          if (currentGuess === wordOfTheDay) {
            messageContainer.textContent = 'COORECCCTTTT'
            const data = {
              myRole: App.myRole,
              gameId: App.gameId
            }
            IO.socket.emit('gameWinner', data)
          }
        }
      }
      */
      // private
      // const tileDisplay1 = document.querySelector('.tileContainer1')
      // const tileDisplay2 = document.querySelector('.tileContainer2')

      const messageContainer = document.querySelector('.messageContainer')
      const keyboard = document.querySelector('.keyContainer')
      let isGameEnded = false
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

          tile.setAttribute('data', letter)
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

      async function wordIsValid (guess) {
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
        const guessJson = { guessJson: guessedWord, chosen: chosenWord }
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

      function revealFeedback (colours) {
        const currentTiles = document.querySelector('#boardRow-' + currentRow).childNodes
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

      function checkCurrentRow () {
        if (currentTile > 4) {
          const currentGuess = boardArray[currentRow].join('').toLowerCase()
          const guess = { guess: currentGuess, chosen: chosenWord }
          wordIsValid(guess).then(isValid => {
            if (!isValid) {
              feedbackForGuess('Invalid Word')
              // delete letters in the row
            } else {
              requestFeedback().then((colours) => revealFeedback(colours))
              const options = {
                method: 'POST',

                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(guess)
              }
              const hostWord = chosenWord

              fetch('/word/isWordOfTheDay', options)
                .then((res) => res.json())
                .then((wordOfTheDay) => {
                  console.log(wordOfTheDay)
                  if ((wordOfTheDay === 'word of the day' && hostWord.length !== 5) || guess === hostWord) {
                    const data = {
                      myRole: App.myRole,
                      gameId: App.gameId
                    }
                    IO.socket.emit('gameWinner', data)
                    feedbackForGuess('Correct')
                    isGameEnded = true
                  } else {
                    if (currentRow === 5) {
                      feedbackForGuess('Try again tomorrow')
                      isGameEnded = true
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

      function activatePhysicalKeyBoard () {
        document.addEventListener('keydown', (event) => {
          const letter = event.key
          if (letter === 'Backspace' || letter === 'Enter') { handleClick(letter) } else if (letter.length === 1) { handleClick(letter.toUpperCase()) }
        })
      }
      function feedbackForGuess (feedback) {
        const feedbackElement = document.createElement('p')
        feedbackElement.textContent = feedback
        messageContainer.append(feedbackElement)
        setTimeout(() => messageContainer.removeChild(feedbackElement), 1000)
      }
      generateBoard()
      generateBoard2()
      activatePhysicalKeyBoard()
      generateKeyboard()
    }

  },

  Player: {

    hostSocketId: '',

    myName: '',

    onJoinClick: function () {
      console.log('Clicked "Join A Game"')
      App.gameArea.innerHTML = App.templateJoinGame
    },

    onPlayerStartClick: function () {
      console.log('Player clicked "Start"')
      // collect data to send to the server
      const data = {
        gameId: +(document.getElementById('inputGameId').value)
        // playerName: document.getElementById('inputPlayerName').value || 'anon'
      }
      console.log('chosen word:' + chosenWord)
      App.myRole = 'Player'
      // Send the gameId and playerName to the server
      IO.socket.emit('playerJoinGame', data)
      // App.Player.myName = data.playerName
    },

    updateWaitingScreen: function (data) {
      App.gameArea.innerHTML = App.waitingScreen
      if (IO.socket.id === data.mySocketId) {
        App.myRole = 'Player'
        App.gameId = data.gameId
      }
    },

    declareWinner: function (data) {
      console.log('Winner2 is' + data.myRole)
      const messageContainer = document.querySelector('.messageContainer')
      const text = data.myRole + ' Won!'
      messageContainer.append(text)
    },

    displayGame: function (hostData) {
      App.Player.hostSocketId = hostData.mySocketId

      App.gameArea.innerHTML = App.playerGame
      // IO.socket.emit('hostCountdownFinished', App.gameId)

      const messageContainer = document.querySelector('.messageContainer')
      const keyboard = document.querySelector('.keyContainer')
      let isGameEnded = false
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

          tile.setAttribute('data', letter)
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

      async function wordIsValid (guess) {
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
        console.log('in req feedback:' + chosenWord)
        const guessJson = { guessJson: guessedWord, chosen: chosenWord }
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

      function revealFeedback (colours) {
        const currentTiles = document.querySelector('#boardRow-' + currentRow).childNodes
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

      function checkCurrentRow () {
        if (currentTile > 4) {
          const currentGuess = boardArray[currentRow].join('').toLowerCase()
          const guess = { guess: currentGuess, chosen: chosenWord }
          wordIsValid(guess).then(isValid => {
            if (!isValid) {
              feedbackForGuess('Invalid Word')
              // delete letters in the row
            } else {
              requestFeedback().then((colours) => revealFeedback(colours))
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
                    const data = {
                      myRole: App.myRole,
                      gameId: App.gameId
                    }
                    IO.socket.emit('gameWinner', data)
                    feedbackForGuess('Correct')
                    isGameEnded = true
                  } else {
                    if (currentRow === 5) {
                      feedbackForGuess('Try again tomorrow')
                      isGameEnded = true
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

      function activatePhysicalKeyBoard () {
        document.addEventListener('keydown', (event) => {
          const letter = event.key
          if (letter === 'Backspace' || letter === 'Enter') { handleClick(letter) } else if (letter.length === 1) { handleClick(letter.toUpperCase()) }
        })
      }
      function feedbackForGuess (feedback) {
        const feedbackElement = document.createElement('p')
        feedbackElement.textContent = feedback
        messageContainer.append(feedbackElement)
        setTimeout(() => messageContainer.removeChild(feedbackElement), 1000)
      }
      generateBoard()
      generateBoard2()
      activatePhysicalKeyBoard()
      generateKeyboard()
    }

  }

}
let chosenWord = ''
IO.init()
App.init()
