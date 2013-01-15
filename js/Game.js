var AIR = 0
var DIRT = 1
var ROCK = 2
var WATER = 3

var LEFT = -1
var RIGHT = 1

var TURN_SPEED = 100

function Game(options) {
  var self = {}

  var width = 100
  var height = 100
  var scale = 4

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units(terrain)
  var display = Display(width, height, scale, terrain, players, units)

  terrain.initialize()

  var player1 = players.create()
  var player2 = players.create()

  var base1 = units.dropBase(player1, 4, RIGHT)
  var base2 = units.dropBase(player2, width - 5, LEFT)

  var computer = new ComputerController(player2, base2, units)

  function doTurn() {
    terrain.move()
    units.move()
    display.draw()
  }

  display.attach(options.container)

  display.onClick(function(x, y) {
    base1.fireAt(new Vector(x, y))
  })

  self.launchChopper = function() {
    units.launchChopper(player1, 0, RIGHT)
  }

  self.launchBomber = function() {
    units.launchBomber(player1, 0, RIGHT)
  }
  
  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1

    doTurn()

    runTime = Date.now() - startTime

    if (turn % 100 == 0) {
      console.log('turn', turn, '(' + runTime + 'ms)')
    }

    turnTimeout = setTimeout(incrementTurn, Math.max(0, TURN_SPEED - runTime))
  }

  var turnTimeout = null

  self.start = function() {
    if (turnTimeout == null) {
      incrementTurn()
    }
  }

  self.stop = function() {
    clearTimeout(turnTimeout)
    turnTimeout = null
  }

  return self
}
