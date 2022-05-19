
const keyboard = document.querySelector('.keyContainer')

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Enter',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'Backspace'
]

const handleClick = (letter) => {
  console.log(letter)
  return letter
}

function generateKeyboard () {
  keys.forEach(key => {
    const buttonTag = document.createElement('button')
    buttonTag.textContent = key
    buttonTag.setAttribute('id', key)
    buttonTag.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonTag)
  })
}

generateKeyboard()
