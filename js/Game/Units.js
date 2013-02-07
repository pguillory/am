var EXPLOSION_SIZE = 50

function Units() {
  var self = {}

  var troops = []
  var projectiles = []
  var bases = []
  var bombers = []
  var choppers = []
  var smokes = []
  var paratroops = []
  // var looters = []

  // self.selectNear = function(player, position) {
  //   var min = 10
  //   var result = null
  //   bombers.forEach(function(bomber) {
  //     if (bomber.player === player) {
  //       var distance = bomber.position.minus(position).magnitude()
  //       if (min > distance) {
  //         min = distance
  //         result = bomber
  //       }
  //     }
  //   })
  //   troops.forEach(function(troop) {
  //     if (troop.player === player) {
  //       if (troop.activatable()) {
  //         var distance = troop.position.minus(position).magnitude()
  //         if (min > distance) {
  //           min = distance
  //           result = troop
  //         }
  //       }
  //     }
  //   })
  //   return result
  // }

  self.initialize = function() {
    for (var i = 0; i < 50; i++) {
      var x = Math.floor(Math.random() * (width - 1))
      var y = terrain.drop(x)
      explode(new Vector(x, y), 20)
    }
    smokes = []
    for (var i = 0; i < 10; i++) {
      terrain.move()
    }
  }

  self.createTroop = function(player, position) {
    troops.push(new Troop(player, position))
  }

  self.createExcavator = function(player, position) {
    var excavator = new Excavator(player, position)
    troops.push(excavator)
    return excavator
  }

  self.createProjectile = function(position, velocity, warheadSize) {
    var projectile = new Projectile(position, velocity, warheadSize)
    projectiles.push(projectile)
    return projectile
  }

  self.dropBase = function(player, x) {
    var position = new Vector(x, terrain.drop(x))
    var base = new Base(player, position)
    bases.push(base)
    return base
  }

  self.launchBomber = function(player, x, direction) {
    var position = new Vector(x, 5)
    var velocity = new Vector(direction * 2, 0)
    var bomber = new Bomber(player, position, velocity)
    bombers.push(bomber)
    return bomber
  }

  self.launchTransport = function(player, x, direction) {
    var position = new Vector(x, 5)
    var velocity = new Vector(direction * 2, 0)
    var plane = new Transport(player, position, velocity)
    bombers.push(plane)
    return plane
  }

  self.launchGunship = function(player, x, direction) {
    var position = new Vector(x, 5)
    var velocity = new Vector(direction * 2, 0)
    var plane = new Gunship(player, position, velocity)
    bombers.push(plane)
    return plane
  }

  self.launchChopper = function(player, x, direction) {
    var position = new Vector(x, terrain.drop(x) - 10)
    var velocity = new Vector(direction, 0)
    var chopper = new Chopper(player, position, velocity)
    choppers.push(chopper)
    return chopper
  }

  self.createParatroop = function(player, position) {
    paratroops.push(new Paratroop(player, position))
  }

  self.createSmoke = function(position) {
    smokes.push(new Smoke(position))
  }

  self.createDust = function(position, velocity, material) {
    var dust = new Dust(position, velocity, material)
    smokes.push(dust)
    return dust
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
      var material = terrain.get(impactPosition.x, impactPosition.y)
      if (material === DIRT || material === WATER) {
        terrain.set(impactPosition.x, impactPosition.y, AIR)
      }
      self.createSmoke(impactPosition)
    })
  }

  function explode(position, size) {
    size = size || EXPLOSION_SIZE
    for (var i = 0; i < size; i++) {
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

  self.addEvent('Crash')
  self.addEvent('Egress')

  Plane.prototype.onEgress(function() {
    self.emitEgress(this)
  })

  Chopper.prototype.onEgress(function() {
    self.emitEgress(this)
  })

  Bomber.prototype.onBomb(function(position, velocity, warhead) {
    self.createProjectile(position, velocity, warhead)
    // var projectile = self.createProjectile(this.position, new Vector(this.player.direction * 2, 0), 40)
    // projectile.position.x += this.player.direction
  })

  Transport.prototype.onTroop(function() {
    self.createParatroop(this.player, this.position)
  })

  Chopper.prototype.onSpray(function(velocity) {
    // shoot(this.position, velocity)

    var dust = self.createDust(this.position, velocity, WATER)
    dust.position.y += 1

    // self.createProjectile(this.position, velocity)
    
    // projectiles.push(new Projectile(this.position, velocity, size))
  })

  Chopper.prototype.onCrash(function() {
    explode(this.position, 50)
    self.emitCrash(this)
  })

  Plane.prototype.onCrash(function() {
    explode(this.position, 50)
    self.emitCrash(this)
  })

  Base.prototype.onFire(function(position, velocity) {
    self.createProjectile(position, velocity, 25)
  })

  Gunship.prototype.onShot(function(velocity) {
    self.createProjectile(this.position, velocity, 10)
  })

  Base.prototype.onTroop(function() {
    self.createTroop(this.player, this.position)
  })

  Base.prototype.onExcavator(function() {
    this.player.excavator = self.createExcavator(this.player, this.position)
    this.player.deductGold(EXCAVATOR_VALUE)
  })

  Excavator.prototype.onDeath(function() {
    this.player.excavator = null
  })

  Paratroop.prototype.onTouchdown(function() {
    self.createTroop(this.player, this.position)
  })

  Excavator.prototype.onDig(function(material) {
    // smokes.push(new Dust(this.position, material))
    if (material === WATER) {
      if (Math.random() < 0.5) {
        for (var i = 0; i < 5; i++) {
          self.createSmoke(this.position)
        }
        return
      }
    }
    self.createDust(this.position, new Vector(0, -3).wiggle(2), material)
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

    // rain()
  }

  function rain() {
    for (var i = 0; i < 1; i++) {
      var x = Math.floor(Math.random() * (width - 1))
      self.createDust(new Vector(x, 0), new Vector(0, 5), WATER)
    }
  }

  function moveTroops() {
    troops.forEach(function(troop) {
      var detonate = false

      troops.forEach(function(defender) {
        if (detonate) return

        if (troop.player !== defender.player &&
            troop.collidesWithTroop(defender)) {
          detonate = true
          SOUNDS.hurt()
        }
      })

      if (detonate) {
        explode(troop.position, 10)
      }
    })

    troops = troops.filter(function(troop) {
      return troop.move(terrain, troops)
    })
  }
  
  function moveProjectiles() {
    projectiles = projectiles.filter(function(projectile) {
      return projectile.move(terrain, troops, function(position) {
        if (projectile.warheadSize > 10) {
          SOUNDS.explosion_big()
        } else {
          SOUNDS.explosion_small()
        }
        explode(position, projectile.warheadSize)
      })
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

  self.forEach = function(callback) {
    troops.forEach(callback)
    projectiles.forEach(callback)
    bases.forEach(callback)
    bombers.forEach(callback)
    choppers.forEach(callback)
    smokes.forEach(callback)
    paratroops.forEach(callback)
  }

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
