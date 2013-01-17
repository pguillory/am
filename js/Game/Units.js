function Units(terrain) {
  var self = {}

  var troops = []
  var projectiles = []
  var bases = []
  var bombers = []
  var choppers = []
  var smokes = []
  var paratroops = []

  self.createTroop = function(player, position) {
    troops.push(new Troop(player, position))
  }

  self.createProjectile = function(position, velocity) {
    projectiles.push(new Projectile(position, velocity))
  }

  self.dropBase = function(player, x) {
    var position = new Vector(x, terrain.drop(x))
    var base = new Base(player, position)
    bases.push(base)
    return base
  }

  self.launchBomber = function(player, x, direction) {
    var position = new Vector(x, 5)
    var velocity = new Vector(direction, 0)
    bombers.push(new Bomber(player, position, velocity))
  }

  self.launchChopper = function(player, x, direction) {
    var position = new Vector(x, terrain.drop(x) - 10)
    var velocity = new Vector(direction, 0)
    choppers.push(new Chopper(player, position, velocity))
  }

  self.createParatroop = function(player, position) {
    paratroops.push(new Paratroop(player, position))
  }

  function createSmoke(position) {
    smokes.push(new Smoke(position))
  }

  function shoot(position, velocity) {
    new Projectile(position, velocity).move(terrain, troops, function(impactPosition) {
      terrain.set(impactPosition.x, impactPosition.y, AIR)
      createSmoke(impactPosition)
    })
  }

  function explode(position) {
    for (var i = 0; i < 50; i++) {
      var theta = Math.random() * Math.PI * 2
      var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 20)
      shoot(position, velocity)
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
  // Projectile.prototype.onImpact(function() {
  // })

  Bomber.prototype.onBomb(function() {
    // self.createParatroop(this.player, this.position)
    self.createProjectile(this.position, new Vector(this.direction, 0))
  })

  Chopper.prototype.onShot(function() {
    var theta = (0.3 - 0.1 * Math.random()) * Math.PI
    var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 30)
    shoot(this.position, velocity)
  })

  Base.prototype.onFire(function(position, velocity) {
    self.createProjectile(position, velocity)
  })
  
  Paratroop.prototype.onTouchdown(function() {
    self.createTroop(this.player, this.position)
  })

  self.move = function() {
    moveTroops()
    moveProjectiles()
    moveBases()
    moveBombers()
    moveChoppers()
    moveSmokes()
    moveParatroops()
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

  function moveProjectiles() {
    projectiles = projectiles.filter(function(projectile) {
      return projectile.move(terrain, troops, explode)
    })
  }

  Base.prototype.onTroop(function() {
    self.createTroop(this.player, this.position)
  })

  function moveBases() {
    bases = bases.filter(function(base) {
      return base.move(terrain)
    })
  }
  
  function moveBombers() {
    bombers = bombers.filter(function(bomber) {
      return bomber.move(terrain)
    })
  }

  function moveChoppers() {
    choppers = choppers.filter(function(chopper) {
      return chopper.move(terrain)
    })
  }

  function moveSmokes() {
    smokes = smokes.filter(function(smoke) {
      return smoke.move(terrain)
    })
  }

  function moveParatroops() {
    paratroops = paratroops.filter(function(paratroop) {
      return paratroop.move(terrain)
    })
  }

  // self.forEach = function(callback) {
  //   troops.forEach(callback)
  //   projectiles.forEach(callback)
  //   bases.forEach(callback)
  //   bombers.forEach(callback)
  //   choppers.forEach(callback)
  //   smokes.forEach(callback)
  // }

  self.forEachTroop = function(callback) {
    troops.forEach(callback)
  }

  self.forEachProjectile = function(callback) {
    projectiles.forEach(callback)
  }

  self.forEachBase = function(callback) {
    bases.forEach(callback)
  }

  self.forEachBomber = function(callback) {
    bombers.forEach(callback)
  }

  self.forEachChopper = function(callback) {
    choppers.forEach(callback)
  }

  self.forEachSmoke = function(callback) {
    smokes.forEach(callback)
  }

  self.forEachParatroop = function(callback) {
    paratroops.forEach(callback)
  }

  return self
}
