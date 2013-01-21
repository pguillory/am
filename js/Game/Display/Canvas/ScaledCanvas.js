function ScaledCanvas(canvas, scale) {
  this.canvas = canvas
  this.width = canvas.width * scale
  this.height = canvas.height * scale
  this.scale = scale

  this.element = document.createElement('canvas')
  this.element.setAttribute('width', this.width)
  this.element.setAttribute('height', this.height)

  this.context = this.element.getContext('2d')
  this.imageData = this.context.createImageData(this.width, this.height)

  this.onClick(function(x, y) {
    x = Math.floor(x * canvas.width / this.element.clientWidth)
    y = Math.floor(y * canvas.height / this.element.clientHeight)
    canvas.emitClick(x, y)
  }.bind(this))
}

ScaledCanvas.prototype.addEvent('Click')

ScaledCanvas.prototype.paint = function() {
  var scale = this.scale
  var data1 = this.canvas.getImageData()
  var data2 = this.imageData
  var a1 = data1.data
  var a2 = data2.data
  var w1 = data1.width
  var h1 = data1.height
  var w2 = data2.width
  var s4 = scale * 4
  var w14 = w1 * 4
  var w24 = w2 * 4
  var w2s4 = w2 * s4

  for (var y = 0; y < h1; y++) {
    var ysw24 = y * w2s4
    var yw14 = y * w14
    for (var x = 0; x < w1; x++) {
      var ywx = yw14 + x * 4
      var ysw24xs4 = ysw24 + x * s4
      for (var o = 0; o < 4; o++) {
        var d1 = a1[ywx + o]
        var i2r = ysw24xs4 + o
        var i2rmax = i2r + w2s4
        for (; i2r < i2rmax; i2r += w24) {
          var i2max = i2r + s4
          for (var i2 = i2r; i2 < i2max; i2 += 4) {
            a2[i2] = d1
          }
        }
      }
    }
  }

  this.context.putImageData(data2, 0, 0)
}
