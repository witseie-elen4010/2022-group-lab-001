const validLogins = [
  {
    username: 'admin',
    password: 'user'
  }
]

function validate () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  validLogins.every(validLogin => {
    if (username === validLogin.name && password === validLogin.password) {
      alert('login succesful')
      // break out of loop
      return false
    }
    // if login doesn't match, iterate
    return true
  })
  // no matching logins found
  alert('Invalid username or password')
}
