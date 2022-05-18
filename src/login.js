const validLogins = [
  {
    username: 'admin',
    password: 'user'
  }
]

function validate () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  let found = false
  validLogins.every(validLogin => {
    if (username === validLogin.username && password === validLogin.password) {
      found = true
      alert('login succesful')
      console.log('login succesful')
      // break out of loop
      return false
    }
    // if login doesn't match, iterate
    return true
  })
  // no matching logins found
  if (!found) {
    alert('Invalid username or password')
  }
}

// const submitButton = document.getElementById('submitbtn')
// submitButton.addEventListener('click', function () {
//   validate()
// }, false)
