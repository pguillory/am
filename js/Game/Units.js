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

  self.fireAt = function(target) {
    explode(target)

    // var base = bases[0]
    // var velocity = target.minus(base.position).times(0.17).wiggle(1.0)
    // // .constrainedToMagnitude(10)
    // self.createProjectile(base.position, velocity)
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
    for (var i = 0; i < 40; i++) {
      var theta = Math.random() * Math.PI * 2
      var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 2)
      velocity.y -= 2
      self.createProjectile(position, velocity)
    }
  }

  self.addEvent('ProjectileMoved')
  Projectile.prototype.onMoved(self.emitProjectileMoved)

  function moveProjectiles() {
    var futureProjectiles = []

    projectiles.forEach(function(projectile) {
      if (projectile.move(terrain)) {
        futureProjectiles.push(projectile)
      }
    })

    projectiles = futureProjectiles
  }

  function moveBases() {
    bases.forEach(function(base) {
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
