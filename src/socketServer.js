const express = require('express')

const app = express()

const PORT = 8000

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('Client Connect!')

  socket.on('disconnect', (reason) => {
    console.log('Client Disconnected!', reason)
  })
  socket.on('currentBlackCard', (data) => {
    io.emit('serverBlackCard', data)
    console.log('Current Black Card: ', data.text)
  })
  socket.on('newGame', () => {
    io.emit('serverNewGame')
    console.log('New Game')
  })
})
