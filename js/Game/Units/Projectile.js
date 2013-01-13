function Projectile(position, velocity) {
  this.position = position.clone()
  this.velocity = velocity.clone()
}

Projectile.prototype.addEvent('Moved')

Projectile.prototype.move = function(terrain, troops, impacted) {
  var lastPosition = this.position
  this.position = this.position.plus(this.velocity)
  this.velocity.y += 1

  var p0 = lastPosition.round()
  var p1 = this.position.round()

  var projectileStillGoing = true

  Math.bresenham(p0.x, p0.y, p1.x, p1.y, function(x, y) {
    if (projectileStillGoing) {
      switch (terrain.get(x, y)) {
        case AIR:
          break;
        case null:
          this.emitMoved(p0, new Vector(x, y))
          projectileStillGoing = false
          break;
        default:
          impacted(new Vector(x, y))
          this.emitMoved(p0, new Vector(x, y))
          projectileStillGoing = false
          break;
      }
    }
    if (projectileStillGoing) {
      troops.forEach(function(troop) {
        if (troop.position.x == x && troop.hp > 0) {
          if (troop.position.y == y || troop.position.y - 1 == y) {
            impacted(new Vector(x, y))
            troop.hp -= 1
            projectileStillGoing = false
          }
        }
      })
    }
  }.bind(this))

  if (projectileStillGoing) {
    this.emitMoved(p0, p1)
  }

  return projectileStillGoing
}

Projectile.prototype.toString = function() {
  return 'Projectile(' + this.position.toString() + ', ' + this.velocity.toString() + ')'
}
