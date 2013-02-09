function Pacecar(doTurn) {
  var self = {}

  var turnTimeout = null
  var turn = 0

  function incrementTurn() {
    var startTime = Date.now()
    turn += 1
    doTurn(turn)
    var runTime = Date.now() - startTime
    turnTimeout = setTimeout(incrementTurn, Math.max(0, TURN_SPEED - runTime))
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
