function Pacecar(commandBuffer, server) {
  var self = {}

  var turn = 0
  var turnTimeout = null

  self.addEvent('Turn')



  var localBuffer = []
  var remoteBuffer = []

  for (var i = 0; i < 3; i++) {
    localBuffer.push([])
    server.sendTurn([])
  }

  server.onTurn(function(remoteCommands) {
    remoteBuffer.push(remoteCommands)

    if (turnTimeout == null) {
      console.log('jump start required')
      incrementTurn()
    }
  })

  // function incrementTurn() {
  //   var futureLocalCommands = commandBuffer.cycle()
  //   buffer.push(futureLocalCommands)
  //   server.sendTurn(futureLocalCommands)
  //   localCommands = buffer.shift()
  //
  //   var commands = remoteCommands.concat(localCommands)
  //
  //   self.emitTurn(commands)
  //
  //   turnTimeout = setTimeout(incrementTurn, Math.max(0, nextTurnTime - Date.now()))
  //
  //   nextTurnTime += TURN_INTERVAL_MS
  // })

  // commandMuxer.onTurn(function(commands) {
  //   turnTimeout = setTimeout(function() {
  //     turn += 1
  //     console.log('turn', turn, commands)
  //     self.emitTurn(commands)
  //   }, Math.max(0, nextTurnTime - Date.now()))
  //
  //   nextTurnTime += TURN_INTERVAL_MS
  // })

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
    if (turnTimeout) {
      clearTimeout(turnTimeout)
      turnTimeout = null
    } else {
      incrementTurn()
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
