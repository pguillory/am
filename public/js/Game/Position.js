function Position(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.tap = function(callback) {
  return callback(this.x, this.y)
}

Position.prototype.clone = function() {
  return new Position(this.x, this.y)
}

Position.prototype.add = function(position) {
  this.x += position.x
  this.y += position.y
}

Position.prototype.subtract = function(position) {
  this.x -= position.x
  this.y -= position.y
}

Position.prototype.plus = function(position) {
  return new Position(this.x + position.x, this.y + position.y)
}

Position.prototype.minus = function(position) {
  return new Position(this.x - position.x, this.y - position.y)
}

Position.prototype.times = function(scale) {
  return new Position(this.x * scale, this.y * scale)
}

Position.prototype.wiggle = function(scale) {
  var x = this.x + Math.random() * scale - scale / 2
  var y = this.y + Math.random() * scale - scale / 2
  return new Position(x, y)
}

Position.prototype.round = function() {
  return new Position(Math.round(this.x), Math.round(this.y))
}

Position.prototype.collidesWith = function(position) {
  return this.x === position.x
}

Position.prototype.toString = function() {
  return '<' + this.x + ', ' + this.y + '>'
}
