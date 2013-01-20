function Looter(player, position, material) {
  this.player = player
  this.position = position.clone()
  this.material = material
}

Looter.prototype.addEvent('Done')

Looter.prototype.move = function(terrain) {
  this.position.x -= this.player.direction
  if (this.position.x <= 0 || this.position.x >= width - 1) {
    this.player.gold += 10
    this.emitDone()
    return false
  }

  this.position.y = terrain.drop(this.position.x)
  return true
}

// Looter.prototype.touches = function(position) {
//   if (troop.position.x == position.x && troop.hp > 0) {
//     if (troop.position.y == position.y || troop.position.y - 1 == position.y) {
//       return true
//     }
//   }
//   return false
// }
