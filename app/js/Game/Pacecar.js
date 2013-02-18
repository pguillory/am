function Pacecar(commandBuffer, server) {
  var self = {}

  var turn = 0
  var turnTimeout = null
  var paused = false

  self.addEvent('Turn')
  self.addEvent('Pause')
  self.addEvent('Unpause')



  var localBuffer = []
  var remoteBuffer = []

  for (var i = 0; i < 3; i++) {
    localBuffer.push([])
    server.sendTurn([])
  }

  server.onTurn(function(remoteCommands) {
    remoteBuffer.push(remoteCommands)

    if (turnTimeout === null && paused === false) {
      console.log('jump start required')
      incrementTurn()
    }
  })



  function incrementTurn() {
    turnTimeout = null
    if (remoteBuffer.length === 0) {
      console.log('remoteBuffer is empty')
      return
    }

    var startTime = Date.now()

    var localCommands = commandBuffer.cycle()
    server.sendTurn(localCommands)
    localBuffer.push(localCommands)
    localCommands = localBuffer.shift()

    var remoteCommands = remoteBuffer.shift()
    var commands = remoteCommands.concat(localCommands)

    self.emitTurn(commands)

    var runTime = Date.now() - startTime
    turnTimeout = setTimeout(incrementTurn, Math.max(0, TURN_INTERVAL_MS - runTime))
  }

  self.togglePause = function() {
    if (paused) {
      paused = false
      self.emitUnpause()
      incrementTurn()
    } else {
      paused = true
      self.emitPause()
      clearTimeout(turnTimeout)
      turnTimeout = null
    }
  }

  self.start = function() {
    if (turnTimeout == null) {
      incrementTurn()
    }
  }

  self.stop = function() {
    clearTimeout(turnTimeout)
    turnTimeout = null
  }

  return self
}
