
function generateCode () {
  const digits = '0123456789'
  let code = ''
  // for better security make it more than 4 numbers, but then copyable
  for (let i = 0; i < 4; i++) {
    code += digits[Math.floor(Math.random() * 10)]
  }
  return code
}

const socket = io.connect() // works
let newCode = 0
const codeButton = document.getElementById('generateCode')
codeButton.addEventListener('click', e => {
  e.preventDefault()
  console.log('Button clicked')
  const radios = document.getElementsByName('players')
  let value = 0
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio' && radios[i].checked) {
      value = radios[i].value
    }
  }

  if (value === 0) {
    console.log('No radio selected')
    window.alert('Please Select a Number of Players')
  } else {
    newCode = generateCode()
    window.alert('Code for the game: ' + newCode + '.\nRemember the code and then click OK')
    socket.emit('chat', 'newCode: ' + newCode)
    socket.on('chat', function (data) {
      console.log('code for all:' + data)
      const x = JSON.stringify(data, null, 1)
      newCode = x.replace(/\D/g, '')
      window.alert(newCode)
      // newCode = data
    })
    // window.location.href = ('../views/multi2/' + newCode)
  }
})
const startButton = document.getElementById('startGame')

/* socket.on('connect', function (data) {
        // let roomID = 2436
        // socket.join(roomID)
        console.log('newcode = ' + newCode)
        socket.emit('join', newCode)
    }) */

/* socket.sockets.on('connection', function (socket) {
      socket.on('join', function (data) {
        const room = data.newCode
        socket.join(room)
        socket.sockets.to(room).emit('ready')
    */
socket.on('join', function (data) {
  console.log('Data: ' + data)
  newCode = data.newCode
  window.alert(data.newCode)
})

startButton.addEventListener('click', e => {
  // e.preventDefault()
  console.log('Start Button clicked')
  const gameCode = document.getElementById('code').value

  console.log('Game code:' + gameCode)
  console.log('New Code :' + newCode)
  if (gameCode === newCode) {
    window.location.href = ('../views/multi2')
  } else {
    console.log('enter a code')
    window.alert('Please enter a valid code to play with your friends')
  }
})
