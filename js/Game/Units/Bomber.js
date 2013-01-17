function Bomber(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = this.player.direction
  this.timeToBomb = Math.round(Math.random() * 13)
}

Bomber.prototype.addEvent('Bomb')

Bomber.prototype.move = function(terrain) {
  this.position.x += this.direction

  if (terrain.get(this.position.x, this.position.y) !== AIR) {
    return false
  }

  this.timeToBomb += 1
  this.timeToBomb %= 13
  if (this.timeToBomb == 0) {
    this.emitBomb()
  }
  // this.position.y = 5
  return true
}
