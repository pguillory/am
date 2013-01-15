function Bomber(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
}

Bomber.prototype.addEvent('Bomb')

Bomber.prototype.move = function(terrain) {
  this.position.add(this.velocity)

  if (terrain.get(this.position.x, this.position.y) !== AIR) {
    return false
  }

  if (this.position.x % 13 == 0) {
    this.emitBomb()
  }
  // this.position.y = 5
  return true
}
