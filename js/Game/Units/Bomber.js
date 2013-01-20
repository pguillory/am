function Bomber(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = this.player.direction
  this.timeToBomb = 0
  this.bombing = false
  this.bombs = 4
}

Bomber.prototype.activate = function() {
  this.bombing = true
}

Bomber.prototype.addEvent('Bomb')
Bomber.prototype.addEvent('Crash')

Bomber.prototype.move = function(terrain) {
  this.position.x += this.direction * 2

  switch (terrain.get(this.position.x, this.position.y)) {
    case AIR:
      break
    case null:
      return false
    default:
      this.emitCrash()
      return false
  }

  if (this.bombing && this.bombs > 0) {
    if (this.timeToBomb <= 0) {
      this.emitBomb()
      this.bombs -= 1
      this.timeToBomb = 3
    } else {
      this.timeToBomb -= 1
    }
  }

  // this.position.y = 5
  return true
}
