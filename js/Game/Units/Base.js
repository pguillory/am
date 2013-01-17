function Base(player, position) {
  this.player = player
  this.position = position
  this.timeToTroop = 0
}

Base.prototype.addEvent('Fire')

Base.prototype.fireAt = function(target) {
  origin = this.position.clone()
  origin.y -= 3
  var velocity = target.minus(origin).times(0.17).wiggle(1.0)
  this.emitFire(origin, velocity)
}

Base.prototype.addEvent('Troop')

Base.prototype.move = function(terrain) {
  if (terrain.get(this.position.x, this.position.y + 1) === AIR) {
    this.position.y += 1
  }

  this.timeToTroop += 1
  this.timeToTroop %= 10
  if (this.timeToTroop == 1) {
    this.emitTroop()
  }

  return true
}
