var io = require('socket.io').listen(8001)

var standby = null

io.sockets.on('connection', function(socket) {
  if (standby) {
    console.log('starting game')
    standby.removeAllListeners('disconnect')
    createGame([standby, socket])
    standby = null
  } else {
    console.log('standing by')
    standby = socket
    standby.on('disconnect', function() {
      console.log('disconnected')
      standby = null
    })
  }
})

function createGame(sockets) {
  var seed = Math.floor(Math.random() * Math.pow(2, 50))
  
  sockets.forEach(function(socket, id) {
    socket.emit('initialize', id, seed)

    socket.on('turn', function(commands) {
      sockets[1 - id].emit('turn', commands)
    })
  })
}
