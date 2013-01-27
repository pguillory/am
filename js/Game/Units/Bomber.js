function Bomber(player, position, velocity) {
  Bomber.prototype.__proto__ = Plane.prototype
  Plane.call(this, player, position, velocity)

  this.timeToBomb = 0
  this.bombing = false
  this.bombs = 4
}

Bomber.prototype.addEvent('Bomb')

Bomber.prototype.goldValue = function() {
  return 10 + this.bombs
}

Bomber.prototype.activate = function() {
  this.bombing = true
}

Bomber.prototype.move = function(terrain) {
  if (Plane.prototype.move.call(this, terrain) === false) {
    return false
  }

  if (this.bombing && this.bombs > 0) {
    if (this.timeToBomb <= 0) {
      var position = this.position.plus(new Vector(this.player.direction, 0))
      var velocity = new Vector(this.player.direction * 2, 0)

      this.emitBomb(position, velocity, 140)
      this.bombs -= 1
      this.timeToBomb = 3
    } else {
      this.timeToBomb -= 1
    }
  }

  // this.position.y = 5
  return true
}
