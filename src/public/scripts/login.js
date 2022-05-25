// function validateLogin (username, password, validLogins) {
//   let found = false
//   validLogins.every(validLogin => {
//     if (username === validLogin.username && password === validLogin.password) {
//       found = true
//       // break out of loop
//       return false
//     }
//     // if login doesn't match, iterate
//     return true
//   })
//   if (found) {
//     // login successful
//     return true
//   } else {
//     return false
//   }
// }

const loginForm = document.getElementById('login-form')
const loginButton = document.getElementById('login-form-submit')

loginButton.addEventListener('click', e => {
  e.preventDefault()
  const loginDetails = {
    email: loginForm.username.value,
    password: loginForm.password.value
  }
  // // hard coded temporarily

  // const validLogins = [
  //   {
  //     username: 'admin',
  //     password: 'user'
  //   }
  // ]

  // request options
  const options = {
    method: 'POST',
    body: JSON.stringify(loginDetails),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch('loginapi/login', options)
    .then(response => {
      response.text().then(message => window.alert(message))
      if (response.ok) {
        window.location.href = '../views/index'
      }
      // else {
      //   window.alert('OOPS')
      // }
    })

  // .then(message => window.alert(message))
  // .catch(err => window.alert(err))
  // if (response.ok) {
  //   console.log('Response ok')
  //   window.alert('Login successful')
  // } else {
  //   window.alert(response.message)
  // }
  // })

  // .catch(error => {
  //   console.log('Something went wrong.', error)
  // })
  // if (validateLogin(username, password, validLogins)) {
  //   window.alert('Login succesful')
  //   console.log('Login succesful')
  //   window.location.href = '../views/index'
  // } else {
  //   window.alert('Invalid username or password')
  //   console.log('Invalid username or password')
  // }
}, false)
