function Terrain(width, height) {
  var self = Grid(width, height)
  
  self.increment = function() {
    for (var y = height - 1; y >= 0; y--) {
      for (var x = width - 1; x >= 0; x--) {
        switch (self.get(x, y)) {
          case AIR:
            if (self.get(x, y - 1) == DIRT) {
              self.swap(x, y, x, y - 1)
            }
          break
        }
      }
    }
  }

  return self
}
