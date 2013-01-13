function Projectile(position, velocity) {
  this.lastPosition = position.clone()
  this.position = position.clone()
  this.velocity = velocity.clone()
  this.hp = 1
}

Projectile.prototype.toString = function() {
  return 'Projectile(' + this.position.toString() + ', ' + this.velocity.toString() + ')'
}

Projectile.prototype.move = function(terrain, impact) {
  this.lastPosition = this.position
  this.position = this.position.plus(this.velocity)
  this.velocity.y += 1

  var p0 = this.lastPosition.round()
  var p1 = this.position.round()

  Math.bresenham(p0.x, p0.y, p1.x, p1.y, function(x, y) {
    switch (terrain.get(x, y)) {
      case AIR:
        break;
      case null:
        this.hp = 0
        break;
      default:
        if (this.hp > 0) {
          impact(new Vector(x, y))
        }
        this.hp = 0
        break;
    }
  }.bind(this))
}
