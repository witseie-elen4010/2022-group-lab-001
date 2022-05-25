'use strict'

let io
let wordleSocket

exports.initGame = function (IO, socket) {
  wordleSocket = socket
  io = IO
  console.log(socket.id)
  console.log('Client connected...')
  // host events
  wordleSocket.on('hostCreateNewGame', hostCreateNewGame)
  wordleSocket.on('hostRoomFull', setupGame)
  wordleSocket.on('tellHostGameStarting', startGame)
  // player events
  wordleSocket.on('playerJoinGame', playerJoinGame)
  wordleSocket.on('gameWinner', letOthersKnowWinner)
}

function hostCreateNewGame () {
  // Create a unique Socket.IO Room
  const GameId = (Math.random() * 10000) | 0

  // Return Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit('gameCreated', { gameId: GameId, mySocketId: this.id })
  this.join(GameId)
};

function setupGame (gameId) {
  const sock = this
  const data = {
    mySocketId: sock.id,
    gameId
  }
  io.sockets.in(data.gameId).emit('beginGame', data)
}

function startGame (gameId) {
  console.log('Game Started.')
  // sendWord(0, gameId) // this would be for the option of one player choosing the word.
};

/* function sendWord (word, gameId) {
  const data = 'hello'
  io.sockets.in(gameId).emit('newWordData', data)
}
*/

function playerJoinGame (data) {
  console.log('Player ' + data.playerName + ' is attempting to join game: ' + data.gameId)

  const sock = this

  const room = wordleSocket.adapter.rooms.has(data.gameId)
  // If the room existsmn
  console.log('Room=' + room)
  if (wordleSocket.adapter.rooms.has(data.gameId)) {
    // attach the socket id to the data object.
    data.mySocketId = sock.id
    wordleSocket.join(data.gameId)

    console.log('Player ' + data.playerName + ' joining game: ' + data.gameId)

    io.sockets.in(data.gameId).emit('playerJoinedRoom', data)
  } else {
    this.emit('error', { message: 'This room does not exist.' })
  }
}

function letOthersKnowWinner (data) {
  // tell clients if someone won
  console.log('Winner is' + data.myRole)
  io.sockets.in(data.gameId).emit('winner', data)
  // this.emit('winner', data)
}
