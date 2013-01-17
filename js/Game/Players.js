function Players() {
  var self = {}

  var members = []

  self.reset = function() {
    members = []
  }

  self.create = function(color, direction) {
    var player = new Player(members.length, color, direction)
    members.push(player)
    return player
  }

  self.forEach = function(callback) {
    members.forEach(callback)
    // for (var id = 0; id < members.length; id++) {
    //   callback(members[id])
    // }
  }

  return self
}
