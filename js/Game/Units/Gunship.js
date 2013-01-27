function Gunship(player, position, velocity) {
  Gunship.prototype.__proto__ = Plane.prototype
  Plane.call(this, player, position, velocity)

  this.reticle = new Reticle(this.position)
  this.timeToFire = 0
}

// Gunship.prototype.aimable = true

Gunship.prototype.addEvent('Shot')

Gunship.prototype.goldValue = function() {
  return 10
}

Gunship.prototype.activate = function() {
}

Gunship.prototype.move = function(terrain) {
  if (Plane.prototype.move.call(this, terrain) === false) {
    return false
  }

  var v = this.reticle.target.minus(this.position)
  // console.log('v', v)
  if (v.x > 0 && v.y < v.x) {
    v.y = v.x
  } else if (v.x < 0 && v.y < -v.x) {
    v.y = -v.x
  }
  // console.log('v2', v)
  this.reticle.velocity = v.normalize().times(10)
  

  this.timeToFire -= 1
  if (this.reticle.fire && this.timeToFire <= 0) {
    SOUNDS.shoot()
    this.player.deductGold(BASE_SHOT_VALUE)
    this.emitShot(this.reticle.velocity.wiggle(1.0))
    // this.fireAt(this.reticle.target)
    this.timeToFire = 3
  }

  // this.position.y = 5
  return true
}

// Gunship.prototype.fireAt = function(target) {
//   console.log('gunship fire at ' + target)
// 
//   // origin = this.position.clone()
//   // origin.y -= 3
//   var velocity = target.minus(this.position).normalize().times(10).wiggle(1.0)
//   // velocity.y -= 3
//   this.emitShot(velocity)
// }

Gunship.prototype.draw = function(canvas) {
  Plane.prototype.draw.call(this, canvas)
  this.reticle.draw(canvas)
}
