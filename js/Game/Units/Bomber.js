function Bomber(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = this.player.direction
}

Bomber.prototype.addEvent('Bomb')

Bomber.prototype.move = function(terrain) {
  this.position.x += this.direction

  if (terrain.get(this.position.x, this.position.y) !== AIR) {
    return false
  }

  if (this.position.x % 13 == 0) {
    this.emitBomb()
  }
  // this.position.y = 5
  return true
}
