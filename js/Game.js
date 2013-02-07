var AIR = 0
var WATER = 1
var DIRT = 2
var IRON = 3
var OBSIDIAN = 4
var EMERALD = 5
var SAPPHIRE = 6
var AMETHYST = 7
var DIAMOND = 8

var TERRAIN_COLOR = [
  new Color(210, 210, 255), // air
  new Color(100, 100, 200), // water
  new Color(145, 122, 92),  // dirt
  new Color(160, 160, 160), // iron
  new Color(60, 60, 60),    // obisidian
  new Color(43, 240, 17),   // emerald
  new Color(235, 84, 222),  // amethyst
  new Color(152, 237, 250), // sapphire
  new Color(255, 255, 255), // diamond
]

// new Color(125, 102, 72),
// new Color(50, 50, 200),
// new Color(215, 212, 11),

var STARTING_GOLD = 100
var FUEL_SURCHARGE = 1

var TURNS_PER_COMPUTER_SHOT = 37

var BASE_SHOT_VALUE = 1
var EXCAVATOR_VALUE = 1
var CHOPPER_VALUE = 10

var TERRAIN_VALUE = [0, 0, 0, 1, 2, 5, 10, 20, 50]

var TRAMPLE_RATE = 0.02

var LEFT = -1
var RIGHT = 1

var TURN_SPEED = 100

var width = 160
var height = 100

// function Game(options) {
  var self = {}

  var scale = 4

  var terrain = Terrain(width, height)
  var players = Players()
  var units = Units()

  terrain.initialize()
  units.initialize()

  var player1 = players.create(new Color(200, 50, 50), RIGHT)
  var player2 = players.create(new Color(50, 50, 150), LEFT)

  var base1 = units.dropBase(player1, 5)
  var base2 = units.dropBase(player2, width - 6)

  var controller1 = new Controller(player1, base1)

  var controllers = [controller1]

  // var computer = new ComputerController(player2, base2, units)

  var display = Display(width, height, scale, terrain, players, units, base1)

  function doTurn() {
    // executeCommands(player1)
    terrain.move()
    units.move()
    display.draw()
  }

  var mouse = new Mouse()
  mouse.bind($(document))
  
  mouse.onMove(function(x, y) {
    controller1.aim(x, y)
  })

  // mouse.onClick(function(x, y) {
  //   base1.fireAt(new Vector(x, y))
  // })

  var keyboard = new Keyboard()
  keyboard.bind($(window))

  keyboard.onShiftChange(function(state) {
    controller1.lase(state)
  })

  keyboard.onControlChange(function(state) {
    controller1.fire(state)
  })

  keyboard.onSpace(pause)

  keyboard.onEscape(pause)

  keyboard.onB(function() {
    self.launchBomber()
  })

  keyboard.onP(pause)

  keyboard.onC(function() {
    controller1.requestChopper()
  })

  keyboard.onG(function() {
    self.launchGunship()
  })

  keyboard.onT(function() {
    self.launchTransport()
  })

  keyboard.onS(function() {
    terrain.hardScroll()
  })

  keyboard.onX(function() {
    player1.excavate()
  })

  display.attach()

  player1.goldDisplay = $('<div class="gold-counter">').css({ left: '0' }).appendTo(document.body)
  player2.goldDisplay = $('<div class="gold-counter">').css({ right: '0' }).appendTo(document.body)

  Player.prototype.onGoldChanged(function() {
    this.goldDisplay.text(this.gold)
  })

  player1.gainGold(STARTING_GOLD)
  player2.gainGold(STARTING_GOLD)

  self.launchBomber = function() {
    if (controller1.plane) {
      controller1.plane.activate()
    } else {
      controller1.plane = units.launchBomber(player1, 0, RIGHT)
      player1.deductGold(controller1.plane.goldValue() + FUEL_SURCHARGE)
    }
  }

  self.launchTransport = function() {
    if (controller1.plane) {
      controller1.plane.activate()
    } else {
      controller1.plane = units.launchTransport(player1, 0, RIGHT)
      player1.deductGold(controller1.plane.goldValue() + FUEL_SURCHARGE)
    }
  }

  self.launchGunship = function() {
    if (controller1.plane) {
      controller1.plane.activate()
    } else {
      controller1.plane = units.launchGunship(player1, 0, RIGHT)
      controller1.reticle = controller1.plane.reticle
      player1.deductGold(controller1.plane.goldValue() + FUEL_SURCHARGE)
    }
  }

  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1
    doTurn()
    runTime = Date.now() - startTime
    turnTimeout = setTimeout(incrementTurn, Math.max(0, TURN_SPEED - runTime))
  }

  var turnTimeout = null

  function pause() {
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
// }
