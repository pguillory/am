var HARD_HAT_COLOR = new Color(215, 212, 11)

function Excavator(player, position) {
  this.player = player
  this.position = position.clone()
  this.direction = player.direction
  this.hp = 1
  this.digging = false
}

Excavator.prototype.addEvent('Dig')
Excavator.prototype.addEvent('Throw')

Excavator.prototype.activatable = function() {
  return (this.digging === false)
}

Excavator.prototype.activate = function() {
  this.digging = true
}

Excavator.prototype.move = function(terrain) {
  if (this.hp <= 0) {
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

  return true
  // return (this.hp > 0)
}

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
