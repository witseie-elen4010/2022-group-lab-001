const tileDisplay = document.querySelector('.tileContainer')
const boardArray = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]
let currentRow = 0
let currentTile = 0

boardArray.forEach((boardRow, boardRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'boardRow-' + boardRowIndex)
  boardRow.forEach((tile, tileIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'boardRow-' + boardRowIndex + '-tile-' + tileIndex)
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })
  tileDisplay.append(rowElement)
})

// letter input from keyboard, later should be updated to work with onc screen keyboard
document.addEventListener('keypress', (event) => {
  const letter = event.key
  console.log('this is letter', letter)
  addLetter(letter)
})

const addLetter = (letter) => {
  // to ensure we only enter 5 letters in one row
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById('boardRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = letter
    boardArray[currentRow][currentTile] = letter
    console.log('boardRow', boardArray)
    currentTile++
  }
}
