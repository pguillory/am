function Terrain(width, height) {
  var self = {}

  var values = []

  self.get = function get(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return null
    }
    return values[y * width + x]
  }

  self.addEvent('Changed')

  self.set = function set(x, y, value) {
    values[y * width + x] = value
    self.emitChanged(x, y, value)
  }

  self.forEach = function forEach(callback) {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        callback(x, y, values[y * width + x])
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

  self.swap = function swap(x1, y1, x2, y2) {
    var i1 = y1 * width + x1
    var i2 = y2 * width + x2
    var t = values[i1]
    values[i1] = values[i2]
    values[i2] = t
    self.emitChanged(x1, y1, values[i1])
    self.emitChanged(x2, y2, values[i2])
  }

  self.move = function move() {
    for (var y = height - 1; y >= 0; y--) {
      for (var x = width - 1; x >= 0; x--) {
        switch (self.get(x, y)) {
          case AIR:
            if (self.get(x, y - 1) == DIRT) {
              self.swap(x, y, x, y - 1)
            } else if (self.get(x + 1, y - 1) == DIRT) {
              self.swap(x, y, x + 1, y - 1)
            } else if (self.get(x - 1, y - 1) == DIRT) {
              self.swap(x, y, x - 1, y - 1)
            }
          break
        }
      }
    }
  }

  self.initialize = function initialize() {
    self.fill(AIR)

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (y >= height * 0.6) {
          self.set(x, y, DIRT)
        } else {
          self.set(x, y, AIR)
        }
        // if (y >= x + height / 2 - 10 || y >= width + height - x - height / 2 - 10) {
        //   self.set(x, y, ROCK)
        // }
        // if (y > height - 10 || x > width - 10 || x < 10) {
        //   self.set(x, y, ROCK)
        // }
        // if (y < height / 2) {
        //   self.set(x, y, AIR)
        // }
      }
    }
  }

  self.drop = function drop(x) {
    if (self.get(x, 0) !== AIR) {
      throw new Exception('can not drop at ' + x)
    }
    for (var y = 1; y < height; y++) {
      if (self.get(x, y) !== AIR) {
        return y - 1
      }
    }
  }

  return self
}
