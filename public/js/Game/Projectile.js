function Projectile(position, velocity) {
  this.position = position.clone()
  this.lastPosition = position.clone()
  this.velocity = velocity.clone()
  this.hp = 1
}

Projectile.prototype.kill = function() {
  this.hp = 0
}

Projectile.prototype.alive = function() {
  return (this.hp > 0)
}

Projectile.prototype.toString = function() {
  return 'Projectile(' + this.position.toString() + ', ' + this.lastPosition.toString() + ', ' + this.velocity.toString() + ')'
}
