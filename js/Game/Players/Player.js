function Player(id, color, direction) {
  this.id = id
  this.color = color
  this.direction = direction
}

Player.prototype.toString = function() {
  return 'Player(' + this.id + ')'
}
