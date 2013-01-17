function Troop(player, position) {
  this.player = player
  this.position = position.clone()
  this.hp = 1
}

Troop.prototype.collidesWithTroop = function(defender) {
  return Math.abs(this.position.x - defender.position.x) < 2
}

Troop.prototype.move = function(terrain) {
  this.position.x += this.player.direction
  this.position.y = terrain.drop(this.position.x)
}
