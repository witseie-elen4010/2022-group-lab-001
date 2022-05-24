function validateLogin (username, password, validLogins) {
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

module.exports = validateLogin
