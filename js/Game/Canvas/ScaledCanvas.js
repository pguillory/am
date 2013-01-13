function ScaledCanvas(canvas, scale) {
  this.canvas = canvas
  this.width = canvas.width * scale
  this.height = canvas.height * scale
  this.scale = scale

  this.element = document.createElement('canvas')
  this.element.setAttribute('width', this.width)
  this.element.setAttribute('height', this.height)

  this.context = this.element.getContext('2d')

  this.onClick(function(x, y) {
    canvas.emitClick(Math.floor(x / scale), Math.floor(y / scale))
  })
}

ScaledCanvas.prototype.addEvent('Click')

ScaledCanvas.prototype.paint = function() {
  var data = this.canvas.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  var data2 = this.context.createImageData(this.width, this.height)

  for (var y = 0; y < data.height; y++) {
    for (var x = 0; x < data.width; x++) {
      for (var o = 0; o < 4; o++) {
        var i = (y * data.width + x) * 4 + o
        for (var dy = 0; dy < this.scale; dy++) {
          for (var dx = 0; dx < this.scale; dx++) {
            var y2 = (y * this.scale) + dy
            var x2 = (x * this.scale) + dx
            var i2 = (y2 * data2.width + x2) * 4 + o
            data2.data[i2] = data.data[i]
          }
        }
      }
    }
  }

  this.context.putImageData(data2, 0, 0)
}
