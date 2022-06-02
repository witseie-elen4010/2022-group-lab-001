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
    IO.socket.on('revealColours', IO.othersKnowColours)
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
    if (App.myRole === 'Host') {
      App.Host.displayGame3(data)
      App.myRole = ''
    }

    if (App.myRole === 'Player2') {
      App.myRole = 'Host'
    }
    App[App.myRole].displayGame(data)
  },
  onNewWordData: function (data) {
    App[App.myRole].newWord(data)
  },
  othersKnowIfYouWon: function (data) {
    App[App.myRole].declareWinner(data)
  },
  othersKnowColours: function (data) {
    App[App.myRole].displayColours(data)
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
      App.players3 = true
      App.hostWord = document.getElementById('hostWord').value
      const checker = { guess: App.hostWord }
      wordIsValid(checker).then(isValid => {
        if (!isValid) {
          window.alert('Please choose a valid word')
        } else {
          chosenWord = App.hostWord
          console.log('chosen word:' + chosenWord)
          App.Host.onCreateClick()
        }
      })
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
      App.Host.displayNewGameScreen()
    },

    displayNewGameScreen: function () {
      App.gameArea.innerHTML = App.templateNewGame
      document.getElementById('spanNewGameCode').innerText = App.gameId
    },

    // for multiple players
    updateWaitingScreen: function (data) {
      document.getElementById('btnStart').style.display = 'none'
      // If this is a restarted game, show the screen.
      App.gameArea.innerHTML = App.waitingScreen
      if (App.Host.isNewGame) {
        App.Host.displayNewGameScreen()
      }
      App.Host.players.push(data)

      // Increment the number of players in the room
      App.Host.numPlayersInRoom += 1
      console.log('numberPlayers' + numberPlayers + 'App.players3' + App.players3)
      console.log('data.nplayers;' + data.nplayers + 'App.players3' + App.players3)
      console.log('host myrole: ' + App.myRole)
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
      const text = data.myRole + ' has guessed the word correctly!'
      messageContainer.append(text)
    },

    // the function below used to be much further down( abovecheck current row) in the code, I have moved it up

    revealFeedback: function (colours, feedbackRow) {
      const currentTiles = document.querySelector('#board2Row-' + feedbackRow).childNodes
      currentTiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add('flip') // (causes flip animation)
          tile.classList.add(colours[index])// asign each tile to the approriate colour class to change its colour
        }, 300 * index)// ensure they dont all flip and change colour  at the same time, Higher indexes executed after more time
      })
    },

    displayColours: function (data) {
      if (data.myRole === 'Player') {
        console.log('colours revealed from ' + data.myRole + 's last Turn')
        this.revealFeedback(data.colours, data.row)
      }
    },

    displayGame3: function () {
      App.gameArea.innerHTML = App.observerScreen
    },

    displayGame: function () {
      App.gameArea.innerHTML = App.hostGame
      IO.socket.emit('tellHostGameStarting', App.gameId)
      const logModal = document.querySelector('.logs')

      function viewLogs() {
        console.log('in view logs ')

        logModal.innerHTML = ''
        const logView = document.createElement('div')
        logModal.append(logView)
        fetch('/actions/allActions').then((response) => {
          if (response.ok) {
            return response.json()
          } // Return the response parse as JSON
          else {
            throw 'Failed to load classlist: response code invalid!'
          }
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
      const messageContainer = document.querySelector('.messageContainer')
      const keyboard = document.querySelector('.keyContainer')
      let isGameEnded = false
      const tileDisplay = document.querySelector('.tileContainer1')
      const tileDisplay2 = document.querySelector('.tileContainer2')
      document.getElementById('logButton').onclick = function () {
        console.log('view logs clicked')
        viewLogs()
      }
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

      function generateBoard() {
        // Loop through each row and each tile to create the board
        boardArray.forEach((boardRow, boardRowIndex) => {
          const rowElement = document.createElement('div')
          rowElement.setAttribute('id', 'board1Row-' + boardRowIndex)
          boardRow.forEach((tile, tileIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute(
              'id',
              'board1Row-' + boardRowIndex + '-tile-' + tileIndex
            )
            tileElement.classList.add('tile')
            rowElement.append(tileElement)
          })
          tileDisplay.append(rowElement)
        })
      }
      function generateBoard2() {
        // Loop through each row and each tile to create the board
        boardArray.forEach((boardRow, boardRowIndex) => {
          const rowElement = document.createElement('div')
          rowElement.setAttribute('id', 'board2Row-' + boardRowIndex)
          boardRow.forEach((tile, tileIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute(
              'id',
              'board2Row-' + boardRowIndex + '-tile-' + tileIndex
            )
            tileElement.classList.add('tile')
            rowElement.append(tileElement)
          })
          tileDisplay2.append(rowElement)
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
            'board1Row-' + currentRow + '-tile-' + currentTile
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
          const tile = document.getElementById('board1Row-' + currentRow + '-tile-' + currentTile)
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
        const currentTiles = document.querySelector('#board1Row-' + currentRow).childNodes
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
      // the function below used to be much further down( abovecheck current row) in the code, I have moved it up
      function revealFeedback(colours, feedbackRow) {
        const currentTiles = document.querySelector('#board1Row-' + feedbackRow).childNodes
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
      function logActions(action) {
        // console.log(action)
        const options = {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action)
        }
        // console.log(options)
        fetch('/actions/addAction', options)
      }
      function checkCurrentRow() {
        if (currentTile > 4) {
          const currentGuess = boardArray[currentRow].join('').toLowerCase()
          const guess = { guess: currentGuess, chosen: chosenWord }
          console.log('guess = ' + guess.guess + ' chosen = ' + guess.chosen)
          wordIsValid(guess).then(isValid => {
            if (!isValid) {
              feedbackForGuess('Invalid Word')
            } else {

              const currentDate = new Date()
              logActions({
                guess: currentGuess, typeOfAction: 'guess', initiatedBy: 'player', timeStamp: currentDate.toLocaleString()
              })

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
                    feedbackForGuess('Correct')
                    const feedbackRow = currentRow
                    requestFeedback().then((colours) => {
                      revealFeedback(colours, feedbackRow)
      
                      const data = {
                        myRole: App.myRole,
                        gameId: App.gameId,
                        colours,
                        row: feedbackRow
                      }
                      IO.socket.emit('revealColours', data)// so other players can know aswell
                    })
                    isGameEnded = true
                    IO.socket.emit('gameWinner', data)
                  } else {
                    if (currentRow === 5) {
                      feedbackForGuess('Try again tomorrow')
                      const feedbackRow = currentRow// ensures it wont change before callbacl complete
              requestFeedback().then((colours) => {
                revealFeedback(colours, feedbackRow)

                const data = {
                  myRole: App.myRole,
                  gameId: App.gameId,
                  colours,
                  row: feedbackRow
                }
                IO.socket.emit('revealColours', data)// so other players can know aswell
              })
                      if (chosenWord.length === 0) {
                        fetch('/word/revealWord')
                          .then((response) => response.json())
                          .then((data) => (
                            messageContainer.append('\n The correct answer is: ', data.toUpperCase(), '. ')
                          ))
                      } else { messageContainer.append('\n The correct answer is: ', chosenWord.toUpperCase(), '. ') }
                      isGameEnded = true
                      return
                    }

                    if (currentRow < 5) {
                      feedbackForGuess('Try again')
                      const feedbackRow = currentRow
                      requestFeedback().then((colours) => {
                        revealFeedback(colours, feedbackRow)
        
                        const data = {
                          myRole: App.myRole,
                          gameId: App.gameId,
                          colours,
                          row: feedbackRow
                        }
                        IO.socket.emit('revealColours', data)// so other players can know aswell
                      })
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
      function generateKeyboard() {
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
      numberPlayers += 1
      console.log('numberPlayers ' + numberPlayers)
      App.gameArea.innerHTML = App.templateJoinGame
    },

    onPlayerStartClick: function () {
      console.log('Player clicked "Start"')
      // collect data to send to the server
      App.myRole = 'Player'
      const data = {
        gameId: +(document.getElementById('inputGameId').value),
        nplayers: numberPlayers

      }
      console.log('chosen word:' + chosenWord)

      IO.socket.emit('playerJoinGame', data)
    },

    updateWaitingScreen: function (data) {
      document.getElementById('btnStart').style.display = 'none'

      App.gameArea.innerHTML = App.waitingScreen
      if (IO.socket.id === data.mySocketId) {
        App.myRole = 'Player'
        App.gameId = data.gameId
        console.log('in player updatescreen data.nplayers;' + data.nplayers + 'App.players3' + App.players3)
        if (data.nplayers === 2 && data.players3) {
          App.myRole = 'Player2'
        }
      }
      console.log('player myrole: ' + App.myRole)
    },

    declareWinner: function (data) {
      console.log('Winner2 is' + data.myRole)
      const messageContainer = document.querySelector('.messageContainer')
      const text = data.myRole + ' has guessed the word correctly!'
      messageContainer.append(text)
    },

    revealFeedback: function (colours, feedbackRow) {
      const currentTiles = document.querySelector('#board2Row-' + feedbackRow).childNodes
      currentTiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add('flip') // (causes flip animation)
          tile.classList.add(colours[index])// asign each tile to the approriate colour class to change its colour
        }, 300 * index)// ensure they dont all flip and change colour  at the same time, Higher indexes executed after more time
      })
    },

    displayColours: function (data) {
      console.log('in display colours, my role is ' + data.myRole)
      if (data.myRole === 'Host') {
        console.log('colours revealed from ' + data.myRole + 's last Turn')
        this.revealFeedback(data.colours, data.row)
      }
    },

    displayGame: function (hostData) {
      App.Player.hostSocketId = hostData.mySocketId

      App.gameArea.innerHTML = App.playerGame
      const logModal = document.querySelector('.logs')

      function viewLogs() {
        console.log('in view logs ')

        logModal.innerHTML = ''
        const logView = document.createElement('div')
        logModal.append(logView)
        fetch('/actions/allActions').then((response) => {
          if (response.ok) {
            return response.json()
          } // Return the response parse as JSON
          else {
            throw 'Failed to load classlist: response code invalid!'
          }
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
      const messageContainer = document.querySelector('.messageContainer')
      const keyboard = document.querySelector('.keyContainer')
      let isGameEnded = false
      const tileDisplay = document.querySelector('.tileContainer1')
      const tileDisplay2 = document.querySelector('.tileContainer2')
      document.getElementById('logButton').onclick = function () {
        console.log('view logs clicked')
        viewLogs()
      }
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

      function generateBoard() {
        // Loop through each row and each tile to create the board
        boardArray.forEach((boardRow, boardRowIndex) => {
          const rowElement = document.createElement('div')
          rowElement.setAttribute('id', 'board1Row-' + boardRowIndex)
          boardRow.forEach((tile, tileIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute(
              'id',
              'board1Row-' + boardRowIndex + '-tile-' + tileIndex
            )
            tileElement.classList.add('tile')
            rowElement.append(tileElement)
          })
          tileDisplay.append(rowElement)
        })
      }
      function generateBoard2() {
        // Loop through each row and each tile to create the board
        boardArray.forEach((boardRow, boardRowIndex) => {
          const rowElement = document.createElement('div')
          rowElement.setAttribute('id', 'board2Row-' + boardRowIndex)
          boardRow.forEach((tile, tileIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute(
              'id',
              'board2Row-' + boardRowIndex + '-tile-' + tileIndex
            )
            tileElement.classList.add('tile')
            rowElement.append(tileElement)
          })
          tileDisplay2.append(rowElement)
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
            'board1Row-' + currentRow + '-tile-' + currentTile
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
          const tile = document.getElementById('board1Row-' + currentRow + '-tile-' + currentTile)
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
        const currentTiles = document.querySelector('#board1Row-' + currentRow).childNodes
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

      function revealFeedback(colours, feedbackRow) {
        const currentTiles = document.querySelector('#board1Row-' + feedbackRow).childNodes
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
      function logActions(action) {
        // console.log(action)
        const options = {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action)
        }
        // console.log(options)
        fetch('/actions/addAction', options)
      }
      function checkCurrentRow() {
        if (currentTile > 4) {
          const currentGuess = boardArray[currentRow].join('').toLowerCase()
          const guess = { guess: currentGuess, chosen: chosenWord }
          wordIsValid(guess).then(isValid => {
            if (!isValid) {
              feedbackForGuess('Invalid Word')
              // delete letters in the row
            } else {

              const currentDate = new Date()
              logActions({
                guess: currentGuess, typeOfAction: 'guess', initiatedBy: 'player', timeStamp: currentDate.toLocaleString()
              })

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
                    const feedbackRow = currentRow// ensures it wont change before callbacl complete
                    requestFeedback().then((colours) => {
                      revealFeedback(colours, feedbackRow)
      
                      const data = {
                        myRole: App.myRole,
                        gameId: App.gameId,
                        colours,
                        row: feedbackRow
                      }
                      IO.socket.emit('revealColours', data)// so other players can know aswell
                    })
                    isGameEnded = true
                  } else {
                    if (currentRow === 5) {
                      feedbackForGuess('Try again tomorrow')
                      const feedbackRow = currentRow// ensures it wont change before callbacl complete
                      requestFeedback().then((colours) => {
                        revealFeedback(colours, feedbackRow)
        
                        const data = {
                          myRole: App.myRole,
                          gameId: App.gameId,
                          colours,
                          row: feedbackRow
                        }
                        IO.socket.emit('revealColours', data)// so other players can know aswell
                      })

                      fetch('/word/revealWord')
                        .then((response) => response.json())
                        .then((data) => (messageContainer.append('The correct answer is: ', data.toUpperCase(), '. ')))
                      isGameEnded = true
                      return
                    }
                    if (currentRow < 5) {
                      feedbackForGuess('Try again')
                      const feedbackRow = currentRow// ensures it wont change before callbacl complete
              requestFeedback().then((colours) => {
                revealFeedback(colours, feedbackRow)

                const data = {
                  myRole: App.myRole,
                  gameId: App.gameId,
                  colours,
                  row: feedbackRow
                }
                IO.socket.emit('revealColours', data)// so other players can know aswell
              })
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
      function generateKeyboard() {
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
        document.addEventListener('keyup', (event) => {
          const letter = event.key
          if (letter === 'Backspace' || letter === 'Enter') { handleClick(letter) } else if (letter.length === 1) { handleClick(letter.toUpperCase()) }
        })
      }
      function feedbackForGuess(feedback) {
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
let numberPlayers = 0
IO.init()
App.init()