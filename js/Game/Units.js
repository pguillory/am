var EXPLOSION_SIZE = 50

function Units(terrain) {
  var self = {}

  var troops = []
  var projectiles = []
  var bases = []
  var bombers = []
  var choppers = []
  var smokes = []
  var paratroops = []
  // var looters = []

  self.selectNear = function(player, position) {
    var min = 10
    var result = null
    bombers.forEach(function(bomber) {
      if (bomber.player === player) {
        var distance = bomber.position.minus(position).magnitude()
        if (min > distance) {
          min = distance
          result = bomber
        }
      }
    })
    troops.forEach(function(troop) {
      if (troop.player === player) {
        if (troop.activatable()) {
          var distance = troop.position.minus(position).magnitude()
          if (min > distance) {
            min = distance
            result = troop
          }
        }
      }
    })
    return result
  }

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
    var bomber = new Bomber(player, position, velocity)
    bombers.push(bomber)
    return bomber
  }

  self.launchChopper = function(player, x, direction) {
    var position = new Vector(x, terrain.drop(x) - 10)
    var velocity = new Vector(direction, 0)
    choppers.push(new Chopper(player, position, velocity))
  }

  self.createParatroop = function(player, position) {
    paratroops.push(new Paratroop(player, position))
  }

  self.createSmoke = function(position) {
    smokes.push(new Smoke(position))
  }

  // function probe(p0, p1, impact) {
  //   var going = true
  // 
  //   Math.bresenham(p0.x, p0.y, p1.x, p1.y, function(x, y) {
  //     if (x < 0 || x >= width ||
  //         y < 0 || y >= height) return
  // 
  //     var p = new Vector(x, y)
  // 
  //     if (projectileStillGoing) {
  //       switch (terrain.get(x, y)) {
  //         case AIR:
  //           break;
  //         default:
  //           return false
  //           impacted(p)
  //           // this.emitImpact(new Vector(x, y))
  //           this.emitMoved(p0, p)
  //           going = false
  //           break;
  //       }
  //     }
  // 
  //     if (going) {
  //       troops.forEach(function(troop) {
  //         if (troop.touches(p)) {
  //           impacted(p)
  //           // this.emitImpact(new Vector(x, y))
  //           troop.hp -= 1
  //           going = false
  //         }
  //       })
  //     }
  //   })
  // }

  function shoot(position, velocity) {
    new Projectile(position, velocity).move(terrain, troops, function(impactPosition) {
      if (terrain.get(impactPosition.x, impactPosition.y) == DIRT) {
        terrain.set(impactPosition.x, impactPosition.y, AIR)
      }
      self.createSmoke(impactPosition)
    })
  }

  function explode(position) {
    for (var i = 0; i < EXPLOSION_SIZE; i++) {
      var theta = Math.random() * Math.PI * 2
      var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 10 + 5)
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

  Projectile.prototype.onImpact(function(p) {
    console.log('impact ' + p)
    // explode(p)
  })

  self.addEvent('Egress')
  Bomber.prototype.onEgress(function() {
    self.emitEgress(this)
  })

  Bomber.prototype.onBomb(function() {
    self.createParatroop(this.player, this.position)
    // self.createProjectile(this.position, new Vector(this.direction, 0))
  })

  Chopper.prototype.onShot(function() {
    var theta = (0.3 - 0.1 * Math.random()) * Math.PI
    var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 50 + 50)
    shoot(this.position, velocity)
  })

  Chopper.prototype.onCrash(function() {
    explode(this.position)
  })

  Bomber.prototype.onCrash(function() {
    explode(this.position)
  })

  Base.prototype.onFire(function(position, velocity) {
    self.createProjectile(position, velocity)
  })

  Base.prototype.onTroop(function() {
    self.createTroop(this.player, this.position)
  })

  Paratroop.prototype.onTouchdown(function() {
    self.createTroop(this.player, this.position)
  })

  Troop.prototype.onDig(function() {
    smokes.push(new Dust(this.position))
  })

  // Troop.prototype.onLoot(function() {
  //   var x = this.position.x
  //   var y = terrain.drop(x) + 1
  //   var position = new Vector(x, y)
  //   var material = terrain.get(x, y)
  //   terrain.set(x, y, AIR)
  //   troops.push(new Looter(this.player, position, material))
  // })
  // 
  // Looter.prototype.onDone(function() {
  //   self.createTroop(this.player, this.position)
  // })

  self.move = function() {
    moveTroops()
    moveProjectiles()
    moveBases()
    moveBombers()
    moveChoppers()
    moveSmokes()
    moveParatroops()
    // moveLooters()
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

      // if (attacks > 0) {
      //   troop.move(terrain)
      // }
    })

    troops = troops.filter(function(troop) {
      return troop.move(terrain, troops)
    })
  }
  
  function moveProjectiles() {
    projectiles = projectiles.filter(function(projectile) {
      return projectile.move(terrain, troops, explode)
    })
  }

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

  // function moveLooters() {
  //   looters = looters.filter(function(looter) {
  //     return looter.move(terrain)
  //   })
  // }

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
    // looters.forEach(callback)
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
