function Gunship(player, position, velocity) {
  Gunship.prototype.__proto__ = Plane.prototype
  Plane.call(this, player, position, velocity)

  // this.timeToShot = 0
  // this.shooting = false
  this.target = new Vector(0, 0)
}

// Gunship.prototype.aimable = true

Gunship.prototype.addEvent('Shot')

Gunship.prototype.goldValue = function() {
  return 10
}

Gunship.prototype.activate = function(reticle) {
  this.fireAt(new Vector(reticle.x, reticle.y))
  // this.shooting = true
}

Gunship.prototype.move = function(terrain) {
  if (Plane.prototype.move.call(this, terrain) === false) {
    return false
  }

  // if (this.shooting) {
  //   if (this.timeToShot <= 0) {
  //     this.emitShot()
  //     this.timeToShot = 3
  //   } else {
  //     this.timeToShot -= 1
  //   }
  // }

  // this.position.y = 5
  return true
}

Gunship.prototype.fireAt = function(target) {
  console.log('gunship fire at ' + target)

  // origin = this.position.clone()
  // origin.y -= 3
  var velocity = target.minus(this.position).times(0.17).wiggle(1.0)
  // velocity.y -= 3
  this.emitShot(velocity)
}
