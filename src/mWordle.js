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
  wordleSocket.on('hostRoomFull3', setupGame3)

  wordleSocket.on('tellHostGameStarting', startGame)
  // player events
  wordleSocket.on('playerJoinGame', playerJoinGame)
  wordleSocket.on('gameWinner', letOthersKnowWinner)
  wordleSocket.on('revealColours', letOthersKnowColours)

}

function hostCreateNewGame () {
  // Create a unique Socket.IO Room
  const GameId = (Math.random() * 100000) | 0
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

function setupGame3 (data1) {
  console.log('in HostFull3.')

  const sock = data1
  const data = {
    mySocketId: sock.gameId,
    newWord: data1.newWord, // sending chosen word to other players
    gameId: data1.gameId
  }
  io.sockets.in(data.gameId).emit('beginGame3', data)
}

function startGame (gameId) {
  console.log('Game Started.')
};

function playerJoinGame (data) {
  // console.log('Player ' + data.playerName + ' is attempting to join game: ' + data.gameId)

  const sock = this

  const room = wordleSocket.adapter.rooms.has(data.gameId)
  // If the room existsmn
  console.log('Room=' + room)
  if (wordleSocket.adapter.rooms.has(data.gameId)) {
    // attach the socket id to the data object.
    data.mySocketId = sock.id
    wordleSocket.join(data.gameId)

    // console.log('Player ' + data.playerName + ' joining game: ' + data.gameId)

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

function letOthersKnowColours (data) {
  // tell all clients progress of most recent players turn
  console.log('colours revealed from ' + data.myRole + 's last Turn' )
  io.sockets.in(data.gameId).emit('revealColours', data)
  // this.emit('winner', data)
}

