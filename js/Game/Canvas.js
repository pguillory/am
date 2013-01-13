function Canvas(width, height) {
  this.width = width
  this.height = height

  this.element = document.createElement('canvas')
  this.element.setAttribute('width', width)
  this.element.setAttribute('height', height)

  this.context = this.element.getContext('2d')

  this.imageData = this.context.createImageData(width, height)
  
  this.changed = false
}

Canvas.prototype.addEvent('Click')

Canvas.prototype.scaleBy = function(scale) {
  return new ScaledCanvas(this, scale)
}

Canvas.prototype.setPixel = function(x, y, color) {
  var i = (y * this.width + x) * 4
  this.imageData.data[i + 0] = color.red
  this.imageData.data[i + 1] = color.green
  this.imageData.data[i + 2] = color.blue
  this.imageData.data[i + 3] = color.alpha
  this.changed = true
}

Canvas.prototype.drawStreak = function(x0, y0, x1, y1, color) {
  color.alpha = 255

  bresenham(x0, y0, x1, y1, function(x, y) {
    color.alpha -= 40
    this.setPixel(x, y, color)
  }.bind(this))
}

Canvas.prototype.paint = function() {
  if (this.changed) {
    this.context.putImageData(this.imageData, 0, 0)
  }
  this.changed = false
}

Canvas.prototype.draw = function(otherCanvas, x, y) {
  // console.log('draw', this.toString(), otherCanvas.toString(), x, y)
  this.context.drawImage(otherCanvas.element, x, y)
}

Canvas.prototype.clear = function() {
  var i = 0
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      this.imageData.data[i++] = 0
      this.imageData.data[i++] = 0
      this.imageData.data[i++] = 0
      this.imageData.data[i++] = 0
    }
  }
  this.changed = true
}

Canvas.prototype.toString = function() {
  return 'Canvas(' + this.width + ',' + this.height + ')'
}
