function Troop(player, position) {
  this.player = player
  this.position = position.clone()
  this.hp = 1
}

Troop.prototype.addEvent('Loot')

Troop.prototype.collidesWithTroop = function(defender) {
  return Math.abs(this.position.x - defender.position.x) < 2
}

Troop.prototype.move = function(terrain) {
  this.position.x += this.player.direction
  this.position.y = terrain.drop(this.position.x)
  if (terrain.get(this.position.x, this.position.y + 1) > DIRT) {
    this.emitLoot()
    this.hp = 0
  }
  return (this.hp > 0)
}

Troop.prototype.touches = function(position) {
  if (troop.position.x == position.x && troop.hp > 0) {
    if (troop.position.y == position.y || troop.position.y - 1 == position.y) {
      return true
    }
  }
  return false
}
