function Bomber(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = this.player.direction
  this.timeToBomb = 0
  this.bombing = false
}

Bomber.prototype.activate = function() {
  this.bombing = true
}

Bomber.prototype.addEvent('Bomb')

Bomber.prototype.move = function(terrain) {
  this.position.x += this.direction

  if (terrain.get(this.position.x, this.position.y) !== AIR) {
    return false
  }

  if (this.bombing) {
    if (this.timeToBomb <= 0) {
      this.emitBomb()
      this.timeToBomb = 13
    } else {
      this.timeToBomb -= 1
    }
  }

  // this.position.y = 5
  return true
}
