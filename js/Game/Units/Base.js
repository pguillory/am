function Base(player, position) {
  this.player = player
  this.position = position
  this.timeToTroop = 0
}

Base.prototype.addEvent('Fire')

Base.prototype.fireAt = function(target) {
  origin = this.position.clone()
  origin.y -= 3
  var velocity = target.minus(origin).times(0.17).wiggle(1.0)
  this.emitFire(origin, velocity)
}

Base.prototype.addEvent('Troop')

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

  if (this.player.id === 0) {
    console.log('player ' + this.player + ' air=' + airUnderBase + ' dirt=' + dirtUnderBase)
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
        terrain.set(this.position.x + dx, this.position.y + dy, AIR)
      }
    }
  }

  this.timeToTroop += 1
  this.timeToTroop %= 10
  if (this.timeToTroop == 1) {
    this.emitTroop()
  }

  return true
}

Base.prototype.draw = function(canvas) {
  var color = this.player.color
  this.position.tap(function(x, y) {
    for (var dy = -3; dy <= 0; dy++) {
      for (var dx = -3; dx <= 3; dx++) {
        canvas.setPixel(x + dx, y + dy, color)
      }
    }
  })
}
