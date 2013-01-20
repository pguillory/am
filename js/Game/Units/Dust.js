function Dust(position) {
  this.position = position.clone()
  this.position.y -= 1
  this.velocity = new Vector(0, -2).wiggle(1.0)
  this.color = TERRAIN_COLOR[DIRT].clone()
  // this.color = new Color(0, 255, 0)
  this.ttl = 8
  // this.color.alpha = Math.floor(Math.random() * 55) + 200
}

Dust.prototype.move = function(terrain) {
  this.ttl -= 1
  if (this.ttl <= 0) {
    return false
  }
  this.velocity.y += 0.5
  this.position.add(this.velocity)
  if (this.position.x < 0 || this.position.x >= terrain.width ||
      this.position.y < 0 || this.position.y >= terrain.height) return
  // return true

  return true
}

Dust.prototype.draw = function(canvas) {
  var color = this.color

  this.position.round().tap(function(x, y) {
    canvas.setPixel(x, y, color)
  })
}
