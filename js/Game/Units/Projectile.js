function Projectile(position, velocity) {
  this.position = position.clone()
  this.velocity = velocity.clone()
}

Projectile.prototype.addEvent('Moved')

Projectile.prototype.move = function(terrain) {
  var lastPosition = this.position
  this.position = this.position.plus(this.velocity)
  this.velocity.y += 1

  var p0 = lastPosition.round()
  var p1 = this.position.round()

  var alive = true

  Math.bresenham(p0.x, p0.y, p1.x, p1.y, function(x, y) {
    if (alive) {
      switch (terrain.get(x, y)) {
        case AIR:
          break;
        case null:
          this.emitMoved(p0, new Vector(x, y))
          alive = false
          break;
        default:
          terrain.set(x, y, AIR)
          this.emitMoved(p0, new Vector(x, y))
          alive = false
          break;
      }
    }
  }.bind(this))

  if (alive) {
    this.emitMoved(p0, p1)
  }

  return alive
}

Projectile.prototype.toString = function() {
  return 'Projectile(' + this.position.toString() + ', ' + this.velocity.toString() + ')'
}
