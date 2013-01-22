function Dust(position, velocity, material) {
  this.position = position.clone()
  this.position.y -= 1
  this.velocity = velocity
  this.material = material
  this.color = TERRAIN_COLOR[material].clone()
  // this.color.alpha = 200

  // this.color = new Color(0, 255, 0)
  // this.ttl = 8
  // this.color.alpha = Math.floor(Math.random() * 55) + 200
}

Dust.prototype.move = function(terrain) {
  // this.ttl -= 1
  // if (this.ttl <= 0) {
  //   return false
  // }

  this.velocity.y += 0.5
  this.position.add(this.velocity)

  var p = this.position.round()

  if (p.x < 0 || p.x >= terrain.width) {
    return false
  }

  if (terrain.get(p.x, p.y) !== AIR) {
    if (this.material !== DIRT) {
      x = p.x + Math.floor(Math.random() * 3) - 1
      y = terrain.drop(x)
      terrain.set(x, y, this.material)
    }
    return false
  }

  // return true

  return true
}

Dust.prototype.draw = function(canvas) {
  // var color = TERRAIN_COLOR[this.material]
  var color = this.color

  this.position.round().tap(function(x, y) {
    canvas.setPixel(x, y, color)
  })
}
