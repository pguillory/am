var HARD_HAT_COLOR = new Color(215, 212, 11)
// var HARD_HAT_COLOR = new Color(0, 200, 0)

function Excavator(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = player.direction
  this.hp = 1
  this.digging = false
  this.level = 2
}

Excavator.prototype.addEvent('Dig')
Excavator.prototype.addEvent('Death')

Excavator.prototype.collidesWithTroop = function(defender) {
  return Math.abs(this.position.x - defender.position.x) < 2
}

Excavator.prototype.activatable = function() {
  return true
}

Excavator.prototype.activate = function() {
  if (this.digging) {
    this.digging = false
  } else {
    this.digging = true
    this.direction = -this.direction
  }
}

Excavator.prototype.move = function(terrain) {
  if (this.hp <= 0) {
    this.emitDeath()
    return false
  }

  if (this.digging === false) {
    this.position.x += this.direction
    if (this.position.x < 0 || this.position.x >= width) {
      this.direction = -this.direction
      return this.move(terrain)
    }
  }

  this.position.y = terrain.drop(this.position.x)

  if (this.position.y > height - 10) {
    this.digging = false
  }

  if (this.digging) {
    // this.digToward(terrain, 0, 1)
    // this.digToward(terrain, this.direction, 1)
    // this.digToward(terrain, -this.direction, 1)
    for (var i = 0; i < this.level; i++) {
      var material = terrain.get(this.position.x, this.position.y + 1)
      if (material) {
        this.emitDig(material)
        this.position.y += 1
        terrain.set(this.position.x, this.position.y, AIR)
      }
    }
  } else {
    this.position.y = terrain.drop(this.position.x)
  }

  return true
}

// Excavator.prototype.digToward = function(terrain, dx, dy) {
//   var material = terrain.get(this.position.x + dx, this.position.y + dy)
//   if (material) {
//     this.emitDig(material)
//     terrain.set(this.position.x + dx, this.position.y + dy, AIR)
//   }
// }

Excavator.prototype.touches = function(position) {
  if (troop.position.x == position.x && troop.hp > 0) {
    if (troop.position.y == position.y || troop.position.y - 1 == position.y) {
      return true
    }
  }
  return false
}

Excavator.prototype.draw = function(canvas) {
  var color = this.player.color

  this.position.tap(function(x, y) {
    canvas.setPixel(x, y, color)
    canvas.setPixel(x, y - 1, color)
    canvas.setPixel(x, y - 2, HARD_HAT_COLOR)
  })
}
