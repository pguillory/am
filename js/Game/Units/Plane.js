function Plane(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = this.player.direction
}

Plane.prototype.addEvent('Egress')
Plane.prototype.addEvent('Crash')

Plane.prototype.move = function(terrain) {
  this.position.x += this.direction * 2

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
