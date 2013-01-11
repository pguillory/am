function Base(player, position, velocity) {
  this.player = player
  this.position = position
  this.velocity = velocity
  this.timeToTroop = 0
}

Base.prototype.timeForTroop = function() {
  this.timeToTroop += 1
  this.timeToTroop %= 10
  return (this.timeToTroop == 1)
}
