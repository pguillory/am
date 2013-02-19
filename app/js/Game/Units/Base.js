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
  if (this.player.firedThisTurn && this.timeToFire <= 0 && this.player.gold > 0) {
    this.fire()
  }

  return true
}

Base.prototype.fire = function() {
  // SOUNDS.shoot()
  this.player.deductGold(BASE_SHOT_VALUE)
  console.log('origin: ' + this.origin)
  var d = this.reticle.target.minus(this.origin)
  console.log('d: ' + d)

  var speed = 4

  var v = new Vector(1, Math.abs(d.x / 2) - speed / 2)

  if (d.x < 0) {
    v.x *= -speed
  } else {
    v.x *= speed
  }
  v.y /= -speed

  // console.log('initial v: ' + v)

  if (d.y < 0) {
    var granularity = 0.5
    var gain = d.y
    var launch = v.y
    var impact = v.y
    for (var i = 0; i < 50; i++) {
      // console.log('gain: ' + gain, 'launch: ' + launch, 'impact: ' + impact)
      impact += granularity
      launch -= granularity
      if (impact > 0) {
        console.log('too high, can not reach')
        break
      }
      gain -= launch * granularity
      gain -= impact * granularity
      if (gain > 0) {
        console.log('got it')
        break
      }
    }
    v.y = launch + 0.75 * granularity
    // console.log('adjusted v: ' + v)
  }

  // v.y += 1

  this.emitFire(this.origin, v/*.wiggle(1.0)*/)

  // this.emitFire(this.origin, this.reticle.velocity.wiggle(1.0))
  this.timeToFire = 1
}

Base.prototype.draw = function(canvas) {
  this.reticle.draw(canvas)

  var color = this.player.color
  this.position.tap(function(x, y) {
    for (var dy = -3; dy <= 0; dy += 1) {
      for (var dx = -3; dx <= 3; dx += 1) {
        canvas.setPixel(x + dx, y + dy, color)
      }
    }
  })
}
