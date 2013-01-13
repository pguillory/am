function Vector(x, y) {
  this.x = x
  this.y = y
}

Vector.prototype.tap = function(callback) {
  return callback(this.x, this.y)
}

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y)
}

Vector.prototype.add = function(vector) {
  this.x += vector.x
  this.y += vector.y
}

Vector.prototype.subtract = function(vector) {
  this.x -= vector.x
  this.y -= vector.y
}

Vector.prototype.plus = function(vector) {
  return new Vector(this.x + vector.x, this.y + vector.y)
}

Vector.prototype.minus = function(vector) {
  return new Vector(this.x - vector.x, this.y - vector.y)
}

Vector.prototype.times = function(scale) {
  return new Vector(this.x * scale, this.y * scale)
}

Vector.prototype.wiggle = function(scale) {
  var x = this.x + Math.random() * scale - scale / 2
  var y = this.y + Math.random() * scale - scale / 2
  return new Vector(x, y)
}

Vector.prototype.round = function() {
  return new Vector(Math.round(this.x), Math.round(this.y))
}

Vector.prototype.collidesWith = function(vector) {
  return this.x === vector.x
}

Vector.prototype.toString = function() {
  return '<' + this.x + ', ' + this.y + '>'
}
