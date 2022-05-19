const validate = require('validateLogin')

const button = document.getElementById('addButton')
button.addEventListener('click', function () {
  // hard coded temporarily
  const validLogins = [
    {
      username: 'admin',
      password: 'user'
    }
  ]
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  if (validate(username, password, validLogins)) {
    window.alert('Login succesful')
    console.log('Login succesful')
  } else {
    window.alert('Invalid username or password')
    console.log('Invalid username or password')
  }
}, false)
