function Chopper(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
}

Chopper.prototype.addEvent('Shot')

Chopper.prototype.move = function(terrain) {
  this.position.add(this.velocity)
  if (terrain.get(this.position.x, this.position.y) === AIR) {
    var y = terrain.drop(this.position.x) - 10
    if (this.position.y > y) {
      this.position.y -= 1
    } else if (this.position.y < y) {
      this.position.y += 1
    }

    for (var i = 0; i < 2; i++) {
      this.emitShot()
    }
    return true
  } else {
    return false
  }
}
