function Shrapnel(position, velocity) {
  this.position = position.clone()
  this.lastPosition = position.clone()
  this.velocity = velocity
  this.hp = 1
}
