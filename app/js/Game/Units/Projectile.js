var WHITE = new Color(255, 255, 255)

function Projectile(position, velocity, warheadSize) {
  this.position = position.clone()
  this.lastPosition = this.position
  this.velocity = velocity.clone()
  this.warheadSize = warheadSize
}

Projectile.prototype.addEvent('Moved')
Projectile.prototype.addEvent('Impact')

Projectile.prototype.move = function(terrain, troops, impacted) {
  this.lastPosition = this.position
  this.position = this.position.plus(this.velocity)
  this.velocity.y += 1

  var p0 = this.lastPosition.round()
  var p1 = this.position.round()

  var projectileStillGoing = true

  Math.bresenham(p0.x, p0.y, p1.x, p1.y, function(x, y) {
    if (y < 0) return

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
          // this.emitImpact(new Vector(x, y))
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
            // this.emitImpact(new Vector(x, y))
            troop.hp -= 1
            projectileStillGoing = false
          }
        }
      }.bind(this))
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

Projectile.prototype.draw = function(canvas) {
  var p1 = this.position.round()
  var p0 = this.lastPosition.round()
  canvas.drawStreak(p1.x, p1.y, p0.x, p0.y, WHITE)
}
