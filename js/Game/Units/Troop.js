function Troop(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
  this.hp = 1
}

Troop.prototype.collidesWithTroop = function(defender) {
  return this.position.collidesWith(defender.position)
}

Troop.prototype.move = function(terrain) {
  this.position.add(this.velocity)
  this.position.y = terrain.drop(this.position.x)
}
