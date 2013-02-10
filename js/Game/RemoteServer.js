function RemoteServer() {
  var self = {}

  var socket = io.connect('http://localhost:8001')
  console.log('socket', socket)

  self.addEvent('Initialize')
  self.addEvent('Turn')

  socket.on('initialize', function(id, seed) {
    self.emitInitialize(id, seed)
  })

  socket.on('turn', function(commands) {
    self.emitTurn(commands)
  })

  self.sendTurn = function(commands) {
    socket.emit('turn', commands)
  }
  
  // socket.on('command', function(data) {
  //   
  // })

  return self
}
