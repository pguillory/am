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
    var maxAirY = 0
    var minDirtY = height

    function fall(x, y) {
      switch (self.get(x, y)) {
        case AIR:
          if (self.get(x, y - 1) > AIR) {
            self.swap(x, y, x, y - 1)
          } else if (self.get(x + 1, y - 1) > AIR) {
            self.swap(x, y, x + 1, y - 1)
          } else if (self.get(x - 1, y - 1) > AIR) {
            self.swap(x, y, x - 1, y - 1)
          }
          maxAirY = Math.max(maxAirY, y)
          break
        default:
          minDirtY = Math.min(minDirtY, y)
          break
      }
    }

    for (var y = height - 1; y >= 0; y--) {
      if (y % 2 == 0) {
        for (var x = width - 1; x >= 0; x--) {
          fall(x, y)
        }
      } else {
        for (var x = 0; x < width; x++) {
          fall(x, y)
        }
      }
    }

    if ((maxAirY + minDirtY) / 2 > height / 2) {
      self.scroll()
    }
  }

  self.addEvent('Scrolled')
  
  function randomMineral() {
    var r = Math.random()
    if (r < 0.001) {
      return DIAMOND
    } else if (r < 0.03) {
      return GOLD
    } else {
      return DIRT
    }
  }

  self.scroll = function() {
    for (var y = 1; y < height; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y - 1, self.get(x, y))
      }
    }
    for (var y = height - 1; y < height; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y, randomMineral())
      }
    }
    self.emitScrolled()
  }

  self.initialize = function initialize() {
    self.fill(AIR)

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (y >= height / 2) {
          self.set(x, y, randomMineral())
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
      throw 'can not drop at ' + x
    }
    for (var y = 1; y < height; y++) {
      if (self.get(x, y) !== AIR) {
        return y - 1
      }
    }
    return height - 1
  }

  return self
}
