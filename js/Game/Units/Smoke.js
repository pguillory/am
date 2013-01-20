function Smoke(position) {
  this.position = position
  this.velocity = new Vector(0, -1)
}

Smoke.prototype.move = function(terrain) {
  this.velocity.x = (Math.random() < 0.5) ? 1 : -1
  this.position.add(this.velocity)
  if (this.position.x < 0 || this.position.x >= terrain.width ||
      this.position.y < 0 || this.position.y >= terrain.height) return
  // return true
  return (Math.random() < 0.9)
}
