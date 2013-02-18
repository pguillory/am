function Color(red, green, blue, alpha) {
  this.red = red
  this.green = green
  this.blue = blue
  this.alpha = (alpha === undefined) ? 255 : alpha
}

Color.prototype.clone = function() {
  return new Color(this.red, this.green, this.blue, this.alpha)
}

Color.prototype.toString = function() {
  return 'Color(' + this.red + ',' + this.green + ',' + this.blue + ')'
}

Color.prototype.toStyle = function() {
  return 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')'
}
