function Terrain(width, height) {
  var self = {}

  var values = []
  
  level = 0

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

    function fall(x, y, direction) {
      switch (self.get(x, y)) {
        case AIR:
          maxAirY = Math.max(maxAirY, y)
          break
        case WATER:
          TERRAIN_COLOR[WATER].alpha = Math.floor(Math.random(100) + 100)
          direction = (Math.random() < 0.5) ? 1 : -1
          if (y + 1 < height) {
            if (self.get(x, y + 1) < WATER) {
              return self.swap(x, y, x, y + 1)
            }
            if (x + direction < width && x + direction >= 0 && self.get(x + direction, y + 1) < WATER) {
              return self.swap(x, y, x + direction, y + 1)
            }
            if (x - direction < width && x - direction >= 0 && self.get(x - direction, y + 1) < WATER) {
              return self.swap(x, y, x - direction, y + 1)
            }
          }
          if (x + direction < width && x + direction >= 0 && self.get(x + direction, y) < WATER) {
            return self.swap(x, y, x + direction, y)
          }
          if (x - direction < width && x - direction >= 0 && self.get(x - direction, y) < WATER) {
            return self.swap(x, y, x - direction, y)
          }
          break
        default:
          if (y + 1 >= height) {
          } else if (self.get(x, y + 1) < DIRT) {
            self.swap(x, y, x, y + 1)
          } else if (x + 1 < width && self.get(x + 1, y + 1) < DIRT) {
            self.swap(x, y, x + 1, y + 1)
          } else if (x > 0 && self.get(x - 1, y + 1) < DIRT) {
            self.swap(x, y, x - 1, y + 1)
          }
          minDirtY = Math.min(minDirtY, y)
          break
      }
    }

    for (var y = height - 1; y >= 0; y--) {
      if (Math.random() < 0.5) {
      // if (y % 2 == 0) {
        for (var x = width - 1; x >= 0; x--) {
          fall(x, y, 1)
        }
      } else {
        for (var x = 0; x < width; x++) {
          fall(x, y, -1)
        }
      }
    }

    if ((maxAirY + minDirtY) / 2 > height / 2) {
      self.scroll()
    }
  }

  self.addEvent('Scrolled')
  
  var frequencies = [
    [0, 0, 98, 3, 0, 0, 0, 0, 0],
    [0, 0, 96, 4, 0, 0, 0, 0, 0],
    [0, 0, 95, 4, 1, 0, 0, 0, 0],
    [0, 0, 95, 3, 2, 0, 0, 0, 0],
    [0, 0, 95, 1, 4, 0, 0, 0, 0],
    [0, 0, 95, 0, 4, 1, 0, 0, 0],
    [0, 0, 95, 0, 3, 2, 0, 0, 0],
    [0, 0, 95, 0, 1, 4, 0, 0, 0],
    [0, 0, 95, 0, 0, 4, 1, 0, 0],
    [0, 0, 95, 0, 0, 3, 2, 0, 0],
    [0, 0, 95, 0, 0, 1, 4, 0, 0],
    [0, 0, 95, 0, 0, 0, 4, 1, 0],
    [0, 0, 95, 0, 0, 0, 3, 2, 0],
    [0, 0, 95, 0, 0, 0, 1, 4, 0],
    [0, 0, 95, 0, 0, 0, 1, 3, 1],
    [0, 0, 95, 0, 0, 0, 0, 4, 1],
  ]

  function randomMineral(x) {
    var freq = frequencies[Math.min(Math.floor(level / 9), frequencies.length - 1)]

    // concentrate minerials in the middle
    var width2 = width / 2
    var centerFactor = Math.abs(x - width2) / width2
    if (Math.random() < centerFactor) {
      return DIRT
    }

    var r = Math.floor(Math.random() * 100)
    var r1 = r

    for (var material = 1; material < 9; material++) {
      if (r < freq[material]) {
        return material
      } else {
        r -= freq[material]
      }
    }
    
    return DIRT
  }

  self.scroll = function() {
    for (var y = 1; y < height; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y - 1, self.get(x, y))
      }
    }

    for (var x = 0; x < width; x++) {
      self.set(x, height - 1, randomMineral(x))
    }
    level += 1

    self.emitScrolled()
  }
  
  self.hardScroll = function() {
    for (var y = 0; y < 10; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y, AIR)
      }
    }
    self.scroll()
  }

  self.initialize = function initialize() {
    self.fill(AIR)

    var surfaceY = Math.round(height / 2)

    for (var y = 0; y < surfaceY; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y, AIR)
      }
    }

    for (var y = surfaceY; y < height; y++) {
      for (var x = 0; x < width; x++) {
        self.set(x, y, randomMineral(x))
      }
      level += 1
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
