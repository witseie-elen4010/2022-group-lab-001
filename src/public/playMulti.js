;
jQuery(function ($) {
  'use strict'
  const IO = {

    init: function () {
      IO.socket = io.connect()
      IO.bindEvents()
    },

    bindEvents: function () {
      IO.socket.on('connected', IO.onConnected)
      IO.socket.on('newGameCreated', IO.onNewGameCreated)
      IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom)
      IO.socket.on('beginNewGame', IO.beginNewGame)
      IO.socket.on('newWordData', IO.onNewWordData)
    },

    onConnected: function () {
      // Cache a copy of the client's socket.IO session ID on the App
      App.mySocketId = IO.socket.id
      // console.log(data.message)
    },

    onNewGameCreated: function (data) {
      App.Host.gameInit(data)
    },
    playerJoinedRoom: function (data) {
      App[App.myRole].updateWaitingScreen(data)
    },

    beginNewGame: function (data) {
      App[App.myRole].gameCountdown(data)
    },
    onNewWordData: function (data) {
      // Update the current round
      // App.currentRound = data.round

      // Change the word for the Host and Player
      App[App.myRole].newWord(data)
    }

  }

  const App = {
    gameId: 0,
    myRole: '', // 'Player' or 'Host'
    mySocketId: '',
    currentRound: 0,

    init: function () {
      App.cacheElements()
      App.showInitScreen()
      App.bindEvents()

      // Initialize the fastclick library
      FastClick.attach(document.body)
    },

    cacheElements: function () {
      App.$doc = $(document)
      // Templates
      App.$gameArea = $('#gameArea')
      App.$templateIntroScreen = $('#intro-screen-template').html()
      App.$templateNewGame = $('#create-game-template').html()
      App.$templateJoinGame = $('#join-game-template').html()
      App.$hostGame = $('#host-game-template').html()
    },

    bindEvents: function () {
      // Host
      App.$doc.on('click', '#btnCreateGame', App.Host.onCreateClick)

      // Player
      App.$doc.on('click', '#btnJoinGame', App.Player.onJoinClick)
      App.$doc.on('click', '#btnStart', App.Player.onPlayerStartClick)
      // App.$doc.on('click', '.btnAnswer', App.Player.onPlayerAnswerClick)
      // App.$doc.on('click', '#btnPlayerRestart', App.Player.onPlayerRestart)
    },

    showInitScreen: function () {
      App.$gameArea.html(App.$templateIntroScreen)
      // App.doTextFit('.title')
    },

    Host: {

      players: [],
      isNewGame: false,
      numPlayersInRoom: 0,

      currentCorrectAnswer: '',
      onCreateClick: function () {
        console.log('Clicked "Create A Game"')
        IO.socket.emit('hostCreateNewGame')
      },

      gameInit: function (data) {
        App.gameId = data.gameId
        App.mySocketId = data.mySocketId
        App.myRole = 'Host'
        App.Host.numPlayersInRoom = 0

        App.Host.displayNewGameScreen()
        // console.log("Game started with ID: " + App.gameId + ' by host: ' + App.mySocketId);
      },

      displayNewGameScreen: function () {
        // Fill the game screen with the appropriate HTML
        App.$gameArea.html(App.$templateNewGame)

        // Display the URL on screen
        // $('#gameURL').text(window.location.href)
        // App.doTextFit('#gameURL')

        // Show the gameId / room id on screen
        $('#spanNewGameCode').text(App.gameId)
      },

      updateWaitingScreen: function (data) {
        // If this is a restarted game, show the screen.
        if (App.Host.isNewGame) {
          App.Host.displayNewGameScreen()
        }
        // Update host screen
        $('#playersWaiting')
          .append('<p/>')
          .text('Player ' + data.playerName + ' joined the game.')

        // Store the new player's data on the Host.
        App.Host.players.push(data)

        // Increment the number of players in the room
        App.Host.numPlayersInRoom += 1

        // If one player(s) have joined, start the game!
        // change using if statements based on user input
        if (App.Host.numPlayersInRoom === 1) {
          // console.log('Room is full. Almost ready!');

          // Let the server know that players are present.
          IO.socket.emit('hostRoomFull', App.gameId)
        }
      },
      gameCountdown: function () {
        // Prepare the game screen with new HTML
        App.$gameArea.html(App.$hostGame)
        // App.doTextFit('#hostWord')

        // Begin the on-screen countdown timer
        /* const $secondsLeft = $('#hostWord')
        App.countDown($secondsLeft, 5, function () {
          IO.socket.emit('hostCountdownFinished', App.gameId)
        })
        */
        IO.socket.emit('hostCountdownFinished', App.gameId)
        // Display the players' names on screen
        $('#player1Score')
          .find('.playerName')
          .html(App.Host.players[0].playerName)

        /* $('#player2Score')
          .find('.playerName')
          .html(App.Host.players[1].playerName)
*/
        // Set the Score section on screen to 0 for each player.
        $('#player1Score').find('.score').attr('id', App.Host.players[0].mySocketId)
        /* $('#player2Score').find('.score').attr('id', App.Host.players[1].mySocketId)
        */
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
      }

    },

    Player: {

      hostSocketId: '',

      myName: '',

      onJoinClick: function () {
        console.log('Clicked "Join A Game"')
        App.$gameArea.html(App.$templateJoinGame)
      },

      onPlayerStartClick: function () {
        console.log('Player clicked "Start"')

        // collect data to send to the server
        const data = {
          gameId: +($('#inputGameId').val()),
          playerName: $('#inputPlayerName').val() || 'anon'
        }

        // Send the gameId and playerName to the server
        IO.socket.emit('playerJoinGame', data)

        // Set the appropriate properties for the current player.
        App.myRole = 'Player'
        App.Player.myName = data.playerName
      },

      updateWaitingScreen: function (data) {
        if (IO.socket.id === data.mySocketId) {
          App.myRole = 'Player'
          App.gameId = data.gameId

          $('#playerWaitingMessage')
            .append('<p/>')
            .text('Joined Game ' + data.gameId + '. Please wait for game to begin.')
        }
      },

      gameCountdown: function (hostData) {
        App.Player.hostSocketId = hostData.mySocketId
        $('#gameArea')
          .html('<div class="gameOver">Get Ready!</div>')
      }

    },

    countDown: function ($el, startTime, callback) {
      // Display the starting time on the screen.
      $el.text(startTime)
      // App.doTextFit('#hostWord')

      console.log('Starting Countdown...')

      // Start a 1 second timer
      const timer = setInterval(countItDown, 1000)

      // Decrement the displayed timer value on each 'tick'
      function countItDown () {
        startTime -= 1
        $el.text(startTime)
        // App.doTextFit('#hostWord')

        if (startTime <= 0) {
          // console.log('Countdown Finished.');

          // Stop the timer and do the callback.
          clearInterval(timer)
          callback()
        }
      }
    }

    /* doTextFit: function (el) {
      textFit(
        $(el)[0],
        {
          alignHoriz: true,
          alignVert: false,
          widthOnly: true,
          reProcess: true,
          maxFontSize: 300
        }
      )
    } */

  }
  IO.init()
  App.init()
})
