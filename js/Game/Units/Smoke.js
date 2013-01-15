function Smoke(position) {
  this.position = position
  this.velocity = new Vector(0, -1)
}

Smoke.prototype.move = function() {
  this.velocity.x = (Math.random() < 0.5) ? 1 : -1
  this.position.add(this.velocity)
  // return true
  return (Math.random() < 0.9)
}
