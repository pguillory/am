function Units(terrain) {
  var self = {}

  var troops = []
  var projectiles = []
  var bases = []
  var shrapnels = []

  self.createTroop = function(player, position, velocity) {
    troops.push(new Troop(player, position, velocity))
  }

  self.createProjectile = function(position, velocity) {
    projectiles.push(new Projectile(position, velocity))
  }

  self.dropBase = function(player, x, direction) {
    var position = new Vector(x, terrain.drop(x))
    var velocity = new Vector(direction, 0)
    bases.push(new Base(player, position, velocity))
  }

  self.fireAt = function(position) {
    var base = bases[0]
    origin = base.position.clone()
    origin.y -= 3
    var velocity = position.minus(origin).times(0.17).wiggle(1.0)
    // .constrainedToMagnitude(10)
    self.createProjectile(origin, velocity)
  }

  self.move = function() {
    moveTroops()
    moveProjectiles()
    moveBases()
  }

  function moveTroops() {
    troops.forEach(function(troop) {
      var attacks = 1

      troops.forEach(function(defender) {
        if (attacks > 0 &&
            troop.player !== defender.player &&
            troop.collidesWithTroop(defender) &&
            defender.hp > 0) {
          attacks -= 1
          defender.hp -= 1
        }
      })

      if (attacks > 0) {
        troop.move(terrain)
      }
    })

    troops = troops.filter(function(troop) {
      return (troop.hp > 0)
    })
  }

  function explode(position) {
    for (var i = 0; i < 50; i++) {
      var theta = Math.random() * Math.PI * 2
      var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 20)
      new Projectile(position, velocity).move(terrain, troops, function(impactPosition) {
        terrain.set(impactPosition.x, impactPosition.y, AIR)
      })
    }
  }

  terrain.onScrolled(function() {
    bases.forEach(function(base) {
      base.position.y -= 1
    })
    projectiles.forEach(function(projectile) {
      projectile.position.y -= 1
    })
  })

  self.addEvent('ProjectileMoved')
  Projectile.prototype.onMoved(self.emitProjectileMoved)

  function moveProjectiles() {
    projectiles = projectiles.filter(function(projectile) {
      return projectile.move(terrain, troops, explode)
    })
  }

  function moveBases() {
    bases.forEach(function(base) {
      if (terrain.get(base.position.x, base.position.y + 1) == AIR) {
        base.position.y += 1
      }
      if (base.timeForTroop()) {
        self.createTroop(base.player, base.position, base.velocity)
      }
    })
  }

  self.forEachTroop = function(callback) {
    troops.forEach(callback)
  }

  self.forEachProjectile = function(callback) {
    projectiles.forEach(callback)
  }

  self.forEachBase = function(callback) {
    bases.forEach(callback)
  }

  return self
}
