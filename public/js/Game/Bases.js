function Bases(units, projectiles) {
  var self = {}

  var bases = []

  self.create = function(player, position, velocity) {
    bases.push(new Base(player, position, velocity))
  }
  
  self.first = function() {
    return bases[0]
  }

  self.increment = function() {
    self.forEach(function(base) {
      base.timeToTroop += 1
      base.timeToTroop %= 10
      if (base.timeToTroop == 1) {
        units.createTroop(base.player, base.position, base.velocity)
      }
    })
  }

  self.fireAt = function(base, target) {
    var velocity = target.minus(base.position).times(0.17).wiggle(1.0)
    // .constrainedToMagnitude(10)
    projectiles.create(base.position, velocity)
  }

  self.forEach = function(callback) {
    bases.forEach(callback)
  }

  return self
}
