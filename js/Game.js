var AIR = 0
var WATER = 1
var DIRT = 2
var IRON = 3
var OBSIDIAN = 4
var EMERALD = 5
var SAPPHIRE = 6
var AMETHYST = 7
var DIAMOND = 8
// RUBY, SAPPHIRE

var TERRAIN_COLOR = [
  new Color(210, 210, 255), // air
  new Color(100, 100, 200),   // water
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

/*
  def executeCommands(player) {
    player.commands.each(function(command) {
      switch (command[0]) {
        case 'target':
          reticle.target.x = command[1]
          reticle.target.y = command[2]
          break
      }
    })
  }
*/

  function doTurn() {
    // executeCommands(player1)
    terrain.move()
    units.move()
    display.draw()
  }

  $(document).on('mousemove', function(event) {
    controller1.reticle.target.x = Math.floor(event.pageX * width / event.target.clientWidth)
    controller1.reticle.target.y = Math.floor(event.pageY * height / event.target.clientHeight)
    // player1.command('target', x, y)
  })

  $(window).on('keyup', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
        controller1.reticle.lase = false
        break
      case 17: //control
        controller1.reticle.fire = false
        break
    }
  })

  $(window).on('keydown', function(event) {
    // event.preventDefault()
    console.log('event.keyCode', event.keyCode)
    switch (event.keyCode) {
      case 16: // shift
        controller1.reticle.lase = true
        break
      case 17: //control
        controller1.reticle.fire = true
        break
      // case 18: // alt
      // case 224: // command
      case 27: // escape
      case 32: // space
        self.pause()
        break
      case 80: // p
        self.pause()
        break
      case 66: // b
        self.launchBomber()
        break
      case 67: // c
        controller1.requestChopper()
        // self.launchChopper()
        break
      case 71: // g
        self.launchGunship()
        break
      case 84: // t
        self.launchTransport()
        break
      case 83: // s
        terrain.hardScroll()
        break
      case 88: // x
        controller1.excavate()
        break
      default:
        // console.log('key', event.keyCode)
        break
    }
  })

  display.attach()

  player1.goldDisplay = $('<div class="gold-counter">').css({ left: '0' }).appendTo(document.body)
  player2.goldDisplay = $('<div class="gold-counter">').css({ right: '0' }).appendTo(document.body)

  Player.prototype.onGoldChanged(function() {
    this.goldDisplay.text(this.gold)
  })

  player1.gainGold(STARTING_GOLD)
  player2.gainGold(STARTING_GOLD)

  // display.onClick(function(x, y) {
  //   base1.fireAt(new Vector(x, y))
  // })

  self.launchChopper = function() {
    if (controller1.chopper) {
      controller1.chopper.activate()
    } else {
      controller1.chopper = units.launchChopper(player1, 0, RIGHT)
      player1.deductGold(CHOPPER_VALUE + FUEL_SURCHARGE)
    }
  }

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

  units.onExcavatorSpawned(function(excavator) {
    controllers.forEach(function(controller) {
      if (controller.player == excavator.player) {
        controller.excavator = excavator
      }
    })
  })
      
  units.onExcavatorSpawned(function(excavator) {
    controller1.excavator = excavator
    excavator.player.deductGold(EXCAVATOR_VALUE)
  })

  units.onExcavatorDied(function(excavator) {
    if (controller1.excavator == excavator) {
      controller1.excavator = null
    }
  })

  units.onCrash(function(unit) {
    switch (unit) {
      case controller1.plane:
        controller1.plane = null
        controller1.reticle = base1.reticle
        break
      case controller1.chopper:
        controller1.chopper = null
        break
    }
  })

  units.onEgress(function(unit) {
    switch (unit) {
      case controller1.plane:
        unit.player.gainGold(unit.goldValue())
        controller1.plane = null
        controller1.reticle = base1.reticle
        break
      case controller1.chopper:
        unit.player.gainGold(CHOPPER_VALUE)
        controller1.chopper = null
        break
    }
  })

  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1
    
    // if (turn % TURNS_PER_COMPUTER_SHOT === 0) {
    //   var x = Math.round((Math.random() * 0.2 + 0.7) * width)
    //   var y = 0
    //   var target = new Vector(x, y)
    //   base2.fireAt(target)
    //   units.createSmoke(target)
    //   // units.createParatroop(player2, target)
    // }

    // if (turn % 327 === 0) {
    //   var bomber = units.launchBomber(player2, width - 1, LEFT)
    //   bomber.activate()
    // }

    doTurn()

    runTime = Date.now() - startTime

    // if (turn % 100 == 0) {
    //   console.log('turn ' + turn + ' (' + runTime + 'ms) ' + player1 + ' ' + player2)
    // }

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
