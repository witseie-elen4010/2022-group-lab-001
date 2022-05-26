const loginForm = document.getElementById('login-form')
const loginButton = document.getElementById('login-form-submit')

loginButton.addEventListener('click', e => {
  e.preventDefault()
  const loginDetails = {
    email: loginForm.username.value,
    password: loginForm.password.value
  }

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
    })
}, false)
