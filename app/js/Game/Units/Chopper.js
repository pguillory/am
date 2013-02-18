function Chopper(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
  this.rotor = 1
  this.shooting = false
  this.timeToShot = 0
  this.water = 50 * this.level
}

Chopper.prototype.level = 3

Chopper.prototype.addEvent('Shot')
Chopper.prototype.addEvent('Spray')
Chopper.prototype.addEvent('Crash')
Chopper.prototype.addEvent('Egress')

Chopper.prototype.activate = function() {
  this.shooting = !this.shooting
}

Chopper.prototype.move = function(terrain) {
  this.rotor = -this.rotor
  this.position.add(this.velocity)

  switch (terrain.get(this.position.x, this.position.y)) {
    case AIR:
      var y = terrain.drop(this.position.x) - 15
      if (this.position.y > y) {
        this.position.y -= 1
      } else if (this.position.y < y) {
        this.position.y += 1
      }
      break
    case null:
      this.player.gainGold(CHOPPER_VALUE)
      this.emitEgress()
      return false
    default:
      this.emitCrash()
      return false
  }

  if (this.shooting) {
    // for (var i = 0; i < this.level; i++) {
    //   var theta = (0.3 - 0.1 * Math.random()) * Math.PI
    //   var velocity = new Vector(Math.cos(theta), Math.sin(theta)).times(Math.random() * 50 + 50)
    //   this.emitShot(velocity)
    // }

    for (var i = 0; i < this.level * 2; i++) {
      if (this.water > 0) {
        this.water -= 1
        var velocity = new Vector(0, 0.5).wiggle(0.5)
        this.emitSpray(velocity)
      }
    }
  }

  return true
}

Chopper.prototype.draw = function(canvas) {
  var color = this.player.color
  var color2 = color.clone()
  color2.alpha /= 2
  var rotor = this.rotor

  this.position.tap(function(x, y) {
    canvas.setPixel(x, y, color)
    canvas.setPixel(x - 1, y, color)
    canvas.setPixel(x - 2, y, color)
    canvas.setPixel(x + 1, y, color)
    canvas.setPixel(x, y - 1, color)
    canvas.setPixel(x, y - 2, color2)
    if (rotor > 0) {
      canvas.setPixel(x - 1, y - 2, color2)
      canvas.setPixel(x - 2, y - 2, color2)
    } else {
      canvas.setPixel(x + 1, y - 2, color2)
      canvas.setPixel(x + 2, y - 2, color2)
    }
  })
}
