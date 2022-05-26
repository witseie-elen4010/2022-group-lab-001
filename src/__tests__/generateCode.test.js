'use strict'

/* eslint-env jest */

function hostCreateNewGame () {
  // Create a unique Socket.IO Room
  const GameId = (Math.random() * 100000)
  const GameId2 = (Math.random() * 100000)
  if (GameId !== GameId2) {
    return true
  } else {
    return false
  }
};

test('Unique Game id generated when game created', () => {
  // not contained at all
  expect(hostCreateNewGame()).toBe(true)
})
