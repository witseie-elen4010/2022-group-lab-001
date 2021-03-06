// email validation front-end function from W3docs
// source: https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html
function validateEmail (email) {
  const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return res.test(String(email).toLowerCase())
}

const signupForm = document?.getElementById('signup-form')
const signupButton = document?.getElementById('signup-form-submit')

signupButton.addEventListener('click', e => {
  e.preventDefault()
  const email = signupForm?.email?.value
  const password = signupForm?.password?.value
  const confirmPassword = signupForm?.confirmPassword?.value

  // front end validation
  if (!validateEmail(email)) {
    window.alert('Invalid email')
    return
  }
  if (password.length < 8) {
    window.alert('Password should be at least 8 characters')
    return
  }
  if (password === email) {
    window.alert('Password should not be the same as your email address')
    return
  }
  if (password !== confirmPassword) {
    window.alert('Passwords do not match')
    return
  }

  // happy case
  const signupDetails = {
    email: signupForm.email.value,
    password: signupForm.password.value,
    confirmPassword: signupForm.confirmPassword.value
  }
  console.log(signupDetails)
  const options = {
    method: 'POST',
    body: JSON.stringify(signupDetails),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch('../loginapi/signup', options)
    .then(response => {
      response.text().then(message => window.alert(message))
      if (response.ok) {
        document.cookie = `email=${signupDetails.email};path=/`
        window.location.href = '../views/index'
      }
      // else {
      //   window.alert('OOPS')
      // }
    })
}, false)
