function Player(id, color, direction) {
  this.id = id
  this.color = color
  this.direction = direction
  this.gold = 0
}

Player.prototype.toString = function() {
  return 'Player(' + this.id + ', ' + this.gold + 'g)'
}
