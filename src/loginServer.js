// email validation front-end function from W3docs
// source: https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html
function validateEmail (email) {
  const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return res.test(String(email).toLowerCase())
}

function login (username, password, validLogins) {
  let found = false
  validLogins.every(validLogin => {
    if (username === validLogin.username && password === validLogin.password) {
      found = true
      // break out of loop
      return false
    }
    // if login doesn't match, iterate
    return true
  })
  if (found) {
    // login successful
    return true
  } else {
    return false
  }
}

function signup (email, password, confirmPassword) {
  // validation
  if (!validateEmail(email)) {
    return false
  }
  if (password.length < 8) {
    return false
  }
  if (password === email) {
    return false
  }
  if (password !== confirmPassword) {
    return false
  }

  // happy case
  console.log(`Successfully logged in as ${email}`)
  return true
}

module.exports.login = login
module.exports.signup = signup
