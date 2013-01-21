function Dust(position, material) {
  this.position = position.clone()
  this.position.y -= 1
  this.velocity = new Vector(0, -3).wiggle(2)
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

  if (this.position.x < 0 || this.position.x >= terrain.width) {
    return false
  }

  var p = this.position.round()
  if (terrain.get(p.x, p.y) !== AIR) {
    if (this.material > DIRT) {
      x = p.x
      y = terrain.drop(x)
      terrain.set(x, y, this.material)
      return false
    }
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
