const express = require('express')

const app = express()

const PORT = 8000

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
const io = require('socket.io')(server)

let SELECTED_WHITE_CARDS = []

function resetGame() {
  io.emit('serverNewGame')
  SELECTED_WHITE_CARDS = []
  console.log('New Game')
}

io.on('connection', (socket) => {
  console.log('Client Connect!')
  resetGame()

  socket.on('disconnect', (reason) => {
    console.log('Client Disconnected!', reason)
  })
  socket.on('currentBlackCard', (data) => {
    io.emit('serverBlackCard', data)
    console.log('Current Black Card: ', data.text)
  })
  socket.on('newGame', () => {
    resetGame()
  })
  socket.on('confirmSelection', (data) => {
    SELECTED_WHITE_CARDS.push(data)
    io.emit('confirmedWhiteCards', SELECTED_WHITE_CARDS)
    console.log('Selected Cards:', SELECTED_WHITE_CARDS)
  })
})
