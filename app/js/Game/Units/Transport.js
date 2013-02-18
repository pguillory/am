function Transport(player, position, velocity) {
  Transport.prototype.__proto__ = Plane.prototype
  Plane.call(this, player, position, velocity)

  this.timeToDrop = 0
  this.dropping = false
  this.troopCount = 2 + this.level * 2
}

Transport.prototype.level = 3

Transport.prototype.addEvent('Troop')

Transport.prototype.goldValue = function() {
  return 10 + this.troopCount
}

Transport.prototype.activate = function() {
  this.dropping = true
}

Transport.prototype.move = function(terrain) {
  if (Plane.prototype.move.call(this, terrain) === false) {
    return false
  }

  if (this.dropping && this.troopCount > 0) {
    if (this.timeToDrop <= 0) {
      this.emitTroop()
      this.troopCount -= 1
      this.timeToDrop = 3
    } else {
      this.timeToDrop -= 1
    }
  }

  return true
}
