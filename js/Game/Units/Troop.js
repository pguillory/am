function Troop(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = player.direction
  this.hp = 1
  this.loot = null
  this.digging = false
}

Troop.prototype.addEvent('Loot')
Troop.prototype.addEvent('Dig')

Troop.prototype.collidesWithTroop = function(defender) {
  return Math.abs(this.position.x - defender.position.x) < 2
}

Troop.prototype.activatable = function() {
  return (this.digging === false && this.loot === null)
}

Troop.prototype.activate = function() {
  if (this.loot === null) {
    this.digging = true
  }
}

Troop.prototype.move = function(terrain) {
  if (this.hp <= 0) {
    if (this.loot) {
      var y = terrain.drop(this.position.x)
      terrain.set(this.position.x, y, this.loot)
    }
    return false
  }

  if (this.digging === false) {
    this.position.x += this.direction
    if (this.position.x < 0 || this.position.x >= width) {
      if (this.loot) {
        this.player.gold += TERRAIN_VALUE[this.loot]
        this.loot = null
      }
      this.direction = -this.direction
      return this.move(terrain)
      // // this.hp = 0
      // return false
    }
  }

  this.position.y = terrain.drop(this.position.x)

  if (this.position.y > height - 10) {
    this.digging = false
  }

  if (this.loot === null) {
    var material = terrain.get(this.position.x, this.position.y + 1)
    if (this.digging && material === DIRT) {
      this.emitDig()
      terrain.set(this.position.x, this.position.y + 1, AIR)
    }
    else if (material > DIRT) {
      this.emitLoot(material)
      this.digging = false
      this.loot = material
      terrain.set(this.position.x, this.position.y + 1, AIR)
      this.direction = -this.player.direction
      // this.emitLoot()
      // return false
      // this.hp = 0
    }
  }

  return true
  // return (this.hp > 0)
}

Troop.prototype.touches = function(position) {
  if (troop.position.x == position.x && troop.hp > 0) {
    if (troop.position.y == position.y || troop.position.y - 1 == position.y) {
      return true
    }
  }
  return false
}

Troop.prototype.draw = function(canvas) {
  var color = this.player.color
  this.position.tap(function(x, y) {
    canvas.setPixel(x, y, color)
    canvas.setPixel(x, y - 1, color)
  })

  if (this.loot) {
    var materialColor = TERRAIN_COLOR[this.loot]
    this.position.tap(function(x, y) {
      canvas.setPixel(x, y - 2, materialColor)
    })
  }
}
