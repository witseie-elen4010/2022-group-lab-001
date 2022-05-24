'use strict'

// Function to generate random code
function generateCode () {
  const digits = '0123456789'
  let code = ''
  // for better security make it more than 4 numbers, but then copyable
  for (let i = 0; i < 4; i++) {
    code += digits[Math.floor(Math.random() * 10)]
  }
  return code
}

const codeButton = document.getElementById('generateCode')

codeButton.addEventListener('click', e => {
  e.preventDefault()
  console.log('Button clicked')
  const radios = document.getElementsByName('players')
  let value = 0
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio' && radios[i].checked) {
      // get value, set checked flag or do whatever you need to
      value = radios[i].value
    }
  }

  if (value === 0) {
    console.log('No radio selected')
    window.alert('Please Select a Number of Players')
  } else {
    const newCode = generateCode()
    window.alert('Code for the game: ' + newCode + '.\nRemember the code and then click OK')
    // window.location.href = ('../views/multi2/' + newCode)
    window.location.href = ('../views/multi2')
  }
})
