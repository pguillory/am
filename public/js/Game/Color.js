function Color(red, green, blue, alpha) {
  this.red = red
  this.green = green
  this.blue = blue
  this.alpha = alpha || 255
}

Color.prototype.clone = function() {
  return new Color(this.red, this.green, this.blue, this.alpha)
}
