function RemoteServer() {
  var self = {}

  var socket = io.connect('http://localhost:8001')
  console.log('socket', socket)

  self.addEvent('Initialize')
  self.addEvent('Command')

  socket.on('initialize', function(data) {
    self.emitInitialize.apply(self, data)
  })
  
  // socket.on('command', function(data) {
  //   
  // })

  return self
}
