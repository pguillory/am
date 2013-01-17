function Paratroop(player, position) {
  this.player = player
  this.position = position.clone()
  this.hp = 1
}

Paratroop.prototype.addEvent('Touchdown')

Paratroop.prototype.move = function(terrain) {
  var r = Math.random()
  if (r < 0.1) {
    this.position.x -= 1
  } else if (r < 0.2) {
    this.position.x += 1
  }
  if (terrain.get(this.position.x, this.position.y + 1) === AIR) {
    this.position.y += 1
    return true
  } else {
    this.emitTouchdown()
    return false
  }
}
