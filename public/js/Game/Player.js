function Player(id, color) {
  this.id = id
  this.color = color
}

Player.prototype.toString = function() {
  return 'Player(' + this.id + ')'
}
