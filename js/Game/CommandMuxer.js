function CommandMuxer(commandBuffer, server) {
  var self = {}

  self.addEvent('Turn')

  var buffer = []

  function cycle() {
    var commands = commandBuffer.cycle()
    buffer.push(commands)
    server.sendTurn(commands)
    return buffer.shift()
  }

  for (var i = 0; i < 3; i++) {
    buffer.push([])
    server.sendTurn([])
  }

  server.onTurn(function(remoteCommands) {
    self.emitTurn(remoteCommands.concat(cycle()))
  })

  return self
}
