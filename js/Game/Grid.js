function Grid(width, height) {
  var self = {}

  var values = []

  self.get = function get(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return null
    }
    return values[y * width + x]
  }

  self.set = function set(x, y, value) {
    values[y * width + x] = value
  }

  self.forEach = function forEach(callback) {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        callback(x, y, get(x, y))
      }
    }
  }

  self.fill = function fill(value) {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        values[y * width + x] = value
      }
    }
  }

  self.swap = function(x1, y1, x2, y2) {
    var i1 = y1 * width + x1
    var i2 = y2 * width + x2
    var t = values[i1]
    values[i1] = values[i2]
    values[i2] = t
  }

  return self
}
