function Chopper(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
  this.rotor = 1
  this.shooting = false
  this.timeToShot = 0
}

Chopper.prototype.level = 1

Chopper.prototype.addEvent('Shot')
Chopper.prototype.addEvent('Crash')
Chopper.prototype.addEvent('Egress')

Chopper.prototype.activate = function() {
  this.shooting = !this.shooting
}

Chopper.prototype.move = function(terrain) {
  this.rotor = -this.rotor
  this.position.add(this.velocity)

  switch (terrain.get(this.position.x, this.position.y)) {
    case AIR:
      var y = terrain.drop(this.position.x) - 15
      if (this.position.y > y) {
        this.position.y -= 1
      } else if (this.position.y < y) {
        this.position.y += 1
      }
      break
    case null:
      this.emitEgress()
      return false
    default:
      this.emitCrash()
      return false
  }

  if (this.shooting) {
    // if (this.timeToShot <= 0) {
      for (var i = 0; i < this.level; i++) {
        var theta = (0.3 - 0.1 * Math.random()) * Math.PI
        var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 50 + 50)
        this.emitShot(velocity)
      }
    //   this.timeToShot = 1
    // } else {
    //   this.timeToShot -= 1
    // }
  }

  return true
}
