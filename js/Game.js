var AIR = 0
var DIRT = 1
var ROCK = 2
var WATER = 3
var GOLD = 4
var DIAMOND = 5

var TERRAIN_COLOR = [
  new Color(210, 210, 255),
  new Color(145, 122, 92),
  new Color(125, 102, 72),
  new Color(50, 50, 200),
  new Color(215, 212, 11),
  new Color(50, 200, 50),
  // new Color(142, 245, 255),
]

var DUST_COLOR = TERRAIN_COLOR[DIRT].clone()

var TERRAIN_VALUE = [
  0,
  0,
  0,
  0,
  1,
  10,
]

var LEFT = -1
var RIGHT = 1

var TURN_SPEED = 100

var width = 160
var height = 100

function Game(options) {
  var self = {}

  var scale = 4

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units(terrain)
  var display = Display(width, height, scale, terrain, players, units)

  terrain.initialize()

  var player1 = players.create(new Color(200, 50, 50), RIGHT)
  var player2 = players.create(new Color(50, 50, 150), LEFT)

  var base1 = units.dropBase(player1, 4)
  var base2 = units.dropBase(player2, width - 5)

  var computer = new ComputerController(player2, base2, units)

  function doTurn() {
    terrain.move()
    units.move()
    display.draw()
  }

  var mouse = {
    x: null,
    y: null,
    down: false,
  }

  $(document).on('mousemove', function(event) {
    mouse.x = Math.floor(event.pageX / scale)
    mouse.y = Math.floor(event.pageY / scale)
    // console.log('mouse', mouse)
  })

  $(document).on('mousedown', function(event) {
    mouse.down = true
    // console.log('mouse', mouse)
  })

  $(document).on('mouseup', function(event) {
    mouse.down = false
    // console.log('mouse', mouse)
  })

  $(window).on('keyup', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
      case 17: //control
      case 18: // alt
      case 224: // command
        mouse.down = false
        // console.log('mouse', mouse)
        break
    }
  })

  $(window).on('keydown', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
      case 17: //control
      case 18: // alt
      case 224: // command
        mouse.down = true
        // console.log('mouse', mouse)
        break
      case 27: // escape
      case 80: // p
        self.pause()
        break
      case 173: // -
        if (TURN_SPEED < 500) {
          TURN_SPEED = Math.floor(TURN_SPEED * 2)
        }
        break
      case 61: // =
        if (TURN_SPEED > 100) {
          TURN_SPEED = Math.floor(TURN_SPEED / 2)
        }
        break
      case 66: // b
        self.launchBomber()
        break
      case 67: // c
        self.launchChopper()
        break
      case 84: // t
        self.createParatroop()
        break
      default:
        console.log('key', event.keyCode)
        break
    }
  })

  display.attach()

  display.onClick(function(x, y) {
    var unit = units.selectNear(player1, new Vector(x, y))
    if (unit) {
      unit.activate()
    }
    // base1.fireAt(new Vector(x, y))
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

    if (mouse.down) {
      units.createSmoke(new Vector(mouse.x, mouse.y))
      units.createSmoke(new Vector(mouse.x, mouse.y))
      units.createSmoke(new Vector(mouse.x, mouse.y))
    }

    if (turn % 37 === 0) {
      var x = Math.round((Math.random() * 0.2 + 0.6) * width)
      var y = 5
      var target = new Vector(x, y)
      base2.fireAt(target)
      units.createSmoke(target)
      // units.createParatroop(player2, target)
    }

    // if (turn % 327 === 0) {
    //   var bomber = units.launchBomber(player2, width - 1, LEFT)
    //   bomber.activate()
    // }

    doTurn()

    runTime = Date.now() - startTime

    if (turn % 100 == 0) {
      console.log('turn ' + turn + ' (' + runTime + 'ms) ' + player1 + ' ' + player2)
    }

    turnTimeout = setTimeout(incrementTurn, Math.max(0, TURN_SPEED - runTime))
  }

  var turnTimeout = null

  self.pause = function() {
    if (turnTimeout) {
      clearTimeout(turnTimeout)
      turnTimeout = null
    } else {
      incrementTurn()
    }
  }

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
