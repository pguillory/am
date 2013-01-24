function Plane(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
}

Plane.prototype.addEvent('Egress')
Plane.prototype.addEvent('Crash')

Plane.prototype.move = function(terrain) {
  this.position.add(this.velocity)

  switch (terrain.get(this.position.x, this.position.y)) {
    case AIR:
      break
    case null:
      this.emitEgress()
      return false
    default:
      this.emitCrash()
      return false
  }

  return true
}
