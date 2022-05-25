'use strict'

let io
let gameSocket
exports.initGame = function (sio, socket) {
  gameSocket = socket
  io = sio
  console.log(socket.id)
  console.log('Client connected...')
  // host events
  gameSocket.on('hostCreateNewGame', hostCreateNewGame)
  gameSocket.on('hostRoomFull', hostPrepareGame)
  gameSocket.on('hostCountdownFinished', hostStartGame)
  // player events
  gameSocket.on('playerJoinGame', playerJoinGame)
  gameSocket.on('gameWinner', letOthersKnowWinner)
}

function hostCreateNewGame () {
  // Create a unique Socket.IO Room
  const thisGameId = (Math.random() * 10000) | 0

  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit('newGameCreated', { gameId: thisGameId, mySocketId: this.id })

  console.log(thisGameId)
  // Join the Room and wait for the players
  this.join(thisGameId)
};

function hostPrepareGame (gameId) {
  const sock = this
  const data = {
    mySocketId: sock.id,
    gameId
  }
  console.log('All Players Present. Preparing game...')
  io.sockets.in(data.gameId).emit('beginNewGame', data)
}

function hostStartGame (gameId) {
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

  // A reference to the player's Socket.IO socket object
  const sock = this

  // Look up the room ID in the Socket.IO manager object.
  const room = gameSocket.adapter.rooms.has(data.gameId)
  // If the room exists...
  console.log('Room=' + room)
  if (gameSocket.adapter.rooms.has(data.gameId)) {
    // attach the socket id to the data object.
    data.mySocketId = sock.id

    // Join the room
    // sock.join(data.gameId)
    gameSocket.join(data.gameId)

    console.log('Player ' + data.playerName + ' joining game: ' + data.gameId)

    // Emit an event notifying the clients that the player has joined the room.
    io.sockets.in(data.gameId).emit('playerJoinedRoom', data)
  } else {
    // Otherwise, send an error message back to the player.
    this.emit('error', { message: 'This room does not exist.' })
  }
}

function letOthersKnowWinner (data) {
  console.log('Winner is' + data)
  io.sockets.in(data).emit('winner', 'your opponent')
  this.emit('winner', data)
}
