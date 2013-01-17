var AIR = 0
var DIRT = 1
var ROCK = 2
var WATER = 3

var LEFT = -1
var RIGHT = 1

var TURN_SPEED = 100

function Game(options) {
  var self = {}

  var width = 200
  var height = 100
  var scale = 3

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units(terrain)
  var display = Display(width, height, scale, terrain, players, units)

  terrain.initialize()

  var player1 = players.create(new Color(200, 50, 50), RIGHT)
  var player2 = players.create(new Color(50, 150, 50), LEFT)

  var base1 = units.dropBase(player1, 4)
  var base2 = units.dropBase(player2, width - 5)

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
  
  self.createParatroop = function() {
    units.createParatroop(player1, new Vector(Math.round(width / 2), 5))
  }
  
  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1

    if (turn % 20 === 0) {
      var x = Math.round((Math.random() * 0.2 + 0.6) * width)
      var y = 5
      var target = new Vector(x, y)
      base2.fireAt(target)
      units.createSmoke(target)
      // units.createParatroop(player2, target)
    }

    if (turn % 127 === 0) {
      units.launchBomber(player2, width - 1, LEFT)
    }

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
