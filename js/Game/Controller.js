function Controller(player_id) {
  var self = {}

  self.addEvent('Command')

  var availableCommands = [
    'excavate',
    'requestChopper',
    'requestBomber',
    'requestTransport',
    'requestGunship',
    'aim',
    'lase',
    'fire',
  ]
  
  availableCommands.forEach(function(method) {
    self[method] = function() {
      self.emitCommand({ player_id: player_id, method: method, args: Array.prototype.slice.apply(arguments) })
    }
  })

  return self
}
