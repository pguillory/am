function Sprite(width, height, imageData) {
  this.width = width
  this.height = height
  this.imageData = imageData
}

Sprite.prototype.setPixel = function(x, y, color) {
  var i = (y * this.width + x) * 4
  this.imageData.data[i + 0] = color.red
  this.imageData.data[i + 1] = color.green
  this.imageData.data[i + 2] = color.blue
  this.imageData.data[i + 3] = color.alpha
}

Sprite.prototype.drawStreak = function(x0, y0, x1, y1, color) {
  color.alpha = 255

  bresenham(x0, y0, x1, y1, function(x, y) {
    color.alpha -= 20
    this.setPixel(x, y, color)
  }.bind(this))
}
