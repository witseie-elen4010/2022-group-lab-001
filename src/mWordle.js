
exports.initGame = function (sio, socket) {
  console.log(socket.id)
  console.log('Client connected...')

  socket.on('chat', function (data) {
    console.log('from server' + data)
    socket.broadcast.emit('chat', data)
    socket.emit('chat', data)
  })
}
