/* eslint-env jest */
const loginServer = require('../controllers/loginController')
const login = loginServer.login
const signup = loginServer.signup

// test login function
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
  expect(login('admin', 'user', validLogins)).toBe(true)
  expect(login('someone', 'password', validLogins)).toBe(true)
})

test('Invalid logins', () => {
  // not contained at all
  expect(login('john', 'secret', validLogins)).toBe(false)
  // valid username, invalid password
  expect(login('admin', 'invalidpassword', validLogins)).toBe(false)
  // valid password of some user, invalid username
  expect(login('john', 'user', validLogins)).toBe(false)
  // username of one user, password of another
  expect(login('admin', 'password', validLogins)).toBe(false)
  // empty password
  expect(login('admin', '', validLogins)).toBe(false)
})

// test signup function
// happy case
test('Valid singup', () => {
  expect(signup('email@example.com', 'letterpassword', 'letterpassword')).toBe(true)
  expect(signup('1234567890@example.com', '!kdjf#kdfj89', '!kdjf#kdfj89')).toBe(true)
})

test('Invalid email', () => {
  expect(signup('plainaddress', '!kdjf#kdfj89', '!kdjf#kdfj89')).toBe(false)
  expect(signup('Joe Smith <email@example.com>', '!kdjf#kdfj89', '!kdjf#kdfj89')).toBe(false)
  expect(signup('email@111.222.333.44444', '!kdjf#kdfj89', '!kdjf#kdfj89')).toBe(false)
})

test('Password less than 8 characters is invalid', () => {
  expect(signup('email@example.com', 'short', 'short')).toBe(false)
  expect(signup('email@example.com', '7letter', '7letter')).toBe(false)
})

test('Non-matching passwords are invalid', () => {
  expect(signup('email@example.com', 'letterpassword', 'Letterpassword')).toBe(false)
  expect(signup('email@example.com', '!kdjf#kdfj89', '!kdjf#kdfj891')).toBe(false)
})

test('Email must not match password', () => {
  expect(signup('email@example.com', 'email@example.com', 'email@example.com')).toBe(false)
})
