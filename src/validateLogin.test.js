/* eslint-env jest */
const validate = require('./validateLogin')

const validLogins = [
  {
    username: 'admin',
    password: 'user'
  },
  {
    username: 'someone',
    password: 'password'
  }
]

test('Valid logins', () => {
  expect(validate('admin', 'user', validLogins)).toBe(true)
  expect(validate('someone', 'password', validLogins)).toBe(true)
})

test('Invalid logins', () => {
  // not contained at all
  expect(validate('john', 'secret', validLogins)).toBe(false)
  // valid username, invalid password
  expect(validate('admin', 'invalidpassword', validLogins)).toBe(false)
  // valid password of some user, invalid username
  expect(validate('john', 'user', validLogins)).toBe(false)
  // username of one user, password of another
  expect(validate('admin', 'password', validLogins)).toBe(false)
  // empty password
  expect(validate('admin', '', validLogins)).toBe(false)
})
