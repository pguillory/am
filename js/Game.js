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

var EXCAVATOR_VALUE = 1
var CHOPPER_VALUE = 10

var TERRAIN_VALUE = [
  0,
  0,
  0,
  1,
  2,
  5,
  10,
  20,
  50,
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

  terrain.initialize()

  var player1 = players.create(new Color(200, 50, 50), RIGHT)
  var player2 = players.create(new Color(50, 50, 150), LEFT)

  var base1 = units.dropBase(player1, 5)
  var base2 = units.dropBase(player2, width - 6)

  var reticle = base1.reticle

  var computer = new ComputerController(player2, base2, units)

  var display = Display(width, height, scale, terrain, players, units, base1)

  function doTurn() {
    terrain.move()
    units.move()
    display.draw()
  }

  $(document).on('mousemove', function(event) {
    reticle.target.x = Math.floor(event.pageX * width / event.target.clientWidth)
    reticle.target.y = Math.floor(event.pageY * height / event.target.clientHeight)
  })

  $(window).on('keyup', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
        reticle.lase = false
        break
      case 17: //control
        reticle.fire = false
        break
    }
  })

  $(window).on('keydown', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
        reticle.lase = true
        break
      case 17: //control
        reticle.fire = true
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
      case 71: // g
        self.launchGunship()
        break
      case 84: // t
        self.launchTransport()
        break
      case 83: // s
        for (var y = 0; y < 10; y++) {
          for (var x = 0; x < width; x++) {
            terrain.set(x, y, AIR)
          }
        }
        terrain.scroll()
        break
      case 88: // x
        if (activeExcavator) {
          activeExcavator.activate()
        } else {
          player1.excavatorRequisitioned = true
        }
        break
      default:
        // console.log('key', event.keyCode)
        break
    }
  })

  display.attach()

  var goldCounter1 = $('<div class="gold-counter">')
      .css({left: '0'})
      .appendTo(document.body)

  var goldCounter2 = $('<div class="gold-counter">')
      .css({right: '0'})
      .appendTo(document.body)

  Player.prototype.onGoldChanged(function() {
    if (this === player1) {
      goldCounter1.text(this.gold)
    } else if (this === player2) {
      goldCounter2.text(this.gold)
    }
  })
  player1.gainGold(STARTING_GOLD)
  player2.gainGold(STARTING_GOLD)

  display.onClick(function(x, y) {
    base1.fireAt(new Vector(x, y))
  })

  var activeChopper = null

  self.launchChopper = function() {
    if (activeChopper) {
      activeChopper.activate()
    } else {
      activeChopper = units.launchChopper(player1, 0, RIGHT)
      player1.deductGold(CHOPPER_VALUE + FUEL_SURCHARGE)
    }
  }
  
  var activePlane = null

  self.launchBomber = function() {
    if (activePlane) {
      activePlane.activate()
    } else {
      activePlane = units.launchBomber(player1, 0, RIGHT)
      player1.deductGold(activePlane.goldValue() + FUEL_SURCHARGE)
    }
  }

  self.launchTransport = function() {
    if (activePlane) {
      activePlane.activate()
    } else {
      activePlane = units.launchTransport(player1, 0, RIGHT)
      player1.deductGold(activePlane.goldValue() + FUEL_SURCHARGE)
    }
  }

  self.launchGunship = function() {
    if (activePlane) {
      activePlane.activate()
    } else {
      activePlane = units.launchGunship(player1, 0, RIGHT)
      reticle = activePlane.reticle
      player1.deductGold(activePlane.goldValue() + FUEL_SURCHARGE)
    }
  }

  var activeExcavator = null

  units.onExcavatorSpawned(function(excavator) {
    activeExcavator = excavator
    excavator.player.deductGold(EXCAVATOR_VALUE)
  })

  units.onExcavatorDied(function(excavator) {
    if (activeExcavator == excavator) {
      activeExcavator = null
    }
  })

  units.onCrash(function(unit) {
    switch (unit) {
      case activePlane:
        activePlane = null
        reticle = base1.reticle
        break
      case activeChopper:
        activeChopper = null
        break
    }
  })

  units.onEgress(function(unit) {
    switch (unit) {
      case activePlane:
        unit.player.gainGold(unit.goldValue())
        activePlane = null
        reticle = base1.reticle
        break
      case activeChopper:
        unit.player.gainGold(CHOPPER_VALUE)
        activeChopper = null
        break
    }
  })

  // self.createParatroop = function() {
  //   units.createParatroop(player1, new Vector(Math.round(width / 2), 5))
  // }
  
  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1
    
    if (turn % TURNS_PER_COMPUTER_SHOT === 0) {
      var x = Math.round((Math.random() * 0.2 + 0.7) * width)
      var y = 0
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
