function Base(player, position) {
  this.player = player
  this.position = position
  this.origin = position.clone()
  this.origin.y -= 3
  this.timeToTroop = 0
  this.timeToFire = 0
  this.reticle = new Reticle(this.origin)
}

Base.prototype.addEvent('Fire')

// Base.prototype.fireAt = function() {
//   SOUNDS.pistol()
//   this.emitFire(this.origin, this.reticle.velocity.wiggle(1.0))
// 
//   // origin = this.position.clone()
//   // origin.y -= 3
//   // var velocity = target.minus(this.origin).times(0.18).wiggle(1.0)
//   // velocity.y -= 3
// }

Base.prototype.addEvent('Troop')
Base.prototype.addEvent('Excavator')

Base.prototype.move = function(terrain) {
  var airUnderBase = false
  var dirtUnderBase = false

  for (var dx = -3; dx <= 3; dx++) {
    switch (terrain.get(this.position.x + dx, this.position.y + 1)) {
    case AIR:
      airUnderBase = true
      break
    case null:
      break
    default:
      dirtUnderBase = true
      break
    }
  }

  if (airUnderBase) {
    if (dirtUnderBase) {
      for (var dx = -3; dx <= 3; dx++) {
        terrain.set(this.position.x + dx, this.position.y + 1, AIR)
      }
    }
    this.position.y += 1
  } else {
    for (var dy = -3; dy <= 0; dy++) {
      for (var dx = -3; dx <= 3; dx++) {
        var material = terrain.get(this.position.x + dx, this.position.y + dy)
        if (material > DIRT) {
          this.player.gainGold(TERRAIN_VALUE[material])
          terrain.set(this.position.x + dx, this.position.y + dy, AIR)
        }
      }
    }
  }

  this.timeToTroop += 1
  this.timeToTroop %= 10
  if (this.timeToTroop == 1) {
    if (this.player.excavatorRequisitioned) {
      this.player.excavatorRequisitioned = false
      this.player.deductGold(EXCAVATOR_VALUE)
      this.emitExcavator()
    } else {
      this.emitTroop()
    }
  }
  
  this.origin.y = this.position.y - 4
  this.reticle.velocity = this.reticle.target.minus(this.origin).times(0.18)

  this.timeToFire -= 1
  if (this.reticle && this.reticle.fire && this.timeToFire <= 0 && this.player.gold > 0) {
    // SOUNDS.shoot()
    this.player.deductGold(BASE_SHOT_VALUE)
    this.emitFire(this.origin, this.reticle.velocity.wiggle(1.0))
    this.timeToFire = 9
  }

  return true
}

Base.prototype.draw = function(canvas) {
  this.reticle.draw(canvas)

  var color = this.player.color
  this.position.tap(function(x, y) {
    for (var dy = -3; dy <= 0; dy += 3) {
      for (var dx = -3; dx <= 3; dx += 3) {
        canvas.setPixel(x + dx, y + dy, color)
      }
    }
  })
}
