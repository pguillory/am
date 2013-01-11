var AIR = 0
var DIRT = 1
var ROCK = 2

var LEFT = -1
var RIGHT = 1

function bresenham(x0, y0, x1, y1, callback) {
  var dx = Math.abs(x1 - x0)
  var dy = Math.abs(y1 - y0)
  var sx = (x0 < x1) ? 1 : -1
  var sy = (y0 < y1) ? 1 : -1
  var err = dx - dy

  while (1) {
    callback(x0, y0)
    if (x0 === x1 && y0 === y1) break
    var e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}

function Game(options) {
  var self = {}

  var width = 100
  var height = 100
  var scale = 2

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units(terrain)
  var display = Display(width, height, scale, terrain, players, units)

  ;(function initialize() {
    terrain.initialize()

    players.reset()

    var player1 = players.create(0, new Color(200, 50, 50))
    units.dropBase(player1, 5, RIGHT)

    var player2 = players.create(1, new Color(50, 50, 200))
    units.dropBase(player2, width - 5, LEFT)
  })()

  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1

    terrain.move()
    units.move()
    display.draw()

    // console.log('turn', turn, Date.now() - startTime)
  }

  display.attach(options.container)
  display.clicked = function(x, y) {
    units.fireAt(new Position(x, y))
  }

  var turnTimeout = null

  self.start = function() {
    if (turnTimeout == null) {
      turnTimeout = setTimeout(function() {
        incrementTurn()
        turnTimeout = null
        self.start()
      }, 100)
    }
  }

  self.stop = function() {
    clearTimeout(turnTimeout)
    turnTimeout = null
  }

  return self
}
