var AIR = 0
var DIRT = 1
var ROCK = 2

function Game(options) {
  var self = {}

  var width = options.width || 320
  var height = options.height || 200
  var scale = options.scale || 1

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units(terrain, players)
  var projectiles = Projectiles(terrain)
  var bases = Bases(units, projectiles)
  var display = Display(width, height, scale, terrain, players, units, bases, projectiles)

  function initialize() {
    terrain.fill(AIR)

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (y >= height / 2) {
          terrain.set(x, y, DIRT)
        }
        // if (y >= x + height / 2 - 10 || y >= width + height - x - height / 2 - 10) {
        //   terrain.set(x, y, ROCK)
        // }
        if (y < height / 2) {
          terrain.set(x, y, AIR)
        }
      }
    }

    players.reset()

    var player1 = players.create(0, new Color(200, 50, 50))
    bases.create(player1, new Position(5, height / 2 - 1), new Position(1, 0))

    var player2 = players.create(1, new Color(50, 50, 200))
    bases.create(player2, new Position(width - 5, height / 2 - 1), new Position(-1, 0))
  }

  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1

    terrain.increment()
    units.increment()
    bases.increment()
    projectiles.increment()
    display.draw()

    // console.log('turn', turn, Date.now() - startTime)
  }

  self.attach = function(container) {
    display.attach(container)
    display.clicked = function(x, y) {
      var base = bases.first()
      bases.fireAt(base, new Position(x, y))
      // terrain.set(x, y, DIRT)
    }
  }

  initialize()

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
