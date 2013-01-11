function Terrain(width, height) {
  var self = Grid(width, height)

  self.move = function() {
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

  self.initialize = function() {
    self.fill(AIR)

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (y >= height / 2) {
          self.set(x, y, DIRT)
        }
        // if (y >= x + height / 2 - 10 || y >= width + height - x - height / 2 - 10) {
        //   self.set(x, y, ROCK)
        // }
        if (y < height / 2) {
          self.set(x, y, AIR)
        }
      }
    }
  }

  self.drop = function(x) {
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
