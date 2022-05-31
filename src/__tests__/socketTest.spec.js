/* eslint-env jest */

'use strict'

const express = require('express')
const app = express() // client asks server for a file (by URL)
const serv = require('http').createServer(app)
const io = require('socket.io')(serv)
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

describe('socket.io emits and performs functions', function () {
  test('emitting', () => {
    io.sockets.on('connection', (socket) => {
      socket.on('hostCreateNewGame', hostCreateNewGame)
    })

    function hostCreateNewGame () {
      const GameId = 1000
      this.emit('gameCreated', { gameId: GameId, mySocketId: this.id })
    };

    // const IO = io.connect()
    io.sockets.on('gameCreated', onNewGameCreated)

    function onNewGameCreated (data) {
      expect(data.GameId).toBe(1000)
    }
  })
})
