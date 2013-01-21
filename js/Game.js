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
  // new Color(215, 212, 11),
  new Color(160, 160, 160),
  new Color(235, 84, 222),
]

var STARTING_GOLD = 100
var FUEL_SURCHARGE = 1

var GOLD_FREQUENCY = 0.03
var GEM_FREQUENCY = 0.001

var TURNS_PER_COMPUTER_SHOT = 37

var EXCAVATOR_VALUE = 1

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

  var reticle = {
    x: null,
    y: null,
    active: false,
  }

  terrain.initialize()

  var player1 = players.create(new Color(200, 50, 50), RIGHT)
  var player2 = players.create(new Color(50, 50, 150), LEFT)

  var base1 = units.dropBase(player1, 5)
  var base2 = units.dropBase(player2, width - 6)

  var computer = new ComputerController(player2, base2, units)

  var display = Display(width, height, scale, terrain, players, units, reticle, base1)

  function doTurn() {
    terrain.move()
    units.move()
    display.draw()
  }

  $(document).on('mousemove', function(event) {
    reticle.x = Math.floor(event.pageX * width / event.target.clientWidth)
    reticle.y = Math.floor(event.pageY * height / event.target.clientHeight)
  })

  $(window).on('keyup', function(event) {
    // event.preventDefault()
    switch (event.keyCode) {
      case 16: // shift
      case 17: //control
      case 18: // alt
      case 224: // command
        reticle.active = false
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
        reticle.active = true
        break
      case 27: // escape
        document.webkitCancelFullScreen()
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
      case 88: // x
        if (activeExcavator) {
          activeExcavator.activate()
        } else {
          player1.excavatorRequisitioned = true
        }
        break
      default:
        console.log('key', event.keyCode)
        break
    }
  })

  display.attach()

  var goldCounter1 = $('<div class="gold-counter">')
      .css({/*color: TERRAIN_COLOR[GOLD].toStyle(),*/ left: '0'})
      .appendTo(document.body)

  var goldCounter2 = $('<div class="gold-counter">')
      .css({/*color: TERRAIN_COLOR[GOLD].toStyle(),*/ right: '0'})
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
    // var unit = units.selectNear(player1, new Vector(x, y))
    // if (unit) {
    //   unit.activate()
    // } else {
      base1.fireAt(new Vector(x, y))
    // }
  })

  self.launchChopper = function() {
    units.launchChopper(player1, 0, RIGHT)
  }
  
  var activeBomber = null

  self.launchBomber = function() {
    if (activeBomber) {
      activeBomber.activate()
    } else {
      if (player1.gold >= 0) {
        activeBomber = units.launchBomber(player1, 0, RIGHT)
        player1.deductGold(activeBomber.goldValue() + FUEL_SURCHARGE)
      }
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

  units.onEgress(function(unit) {
    if (activeBomber === unit) {
      unit.player.gainGold(unit.goldValue())
      activeBomber = null
    }
  })

  // self.createParatroop = function() {
  //   units.createParatroop(player1, new Vector(Math.round(width / 2), 5))
  // }
  
  var turn = 0

  function incrementTurn() {
    startTime = Date.now()
    turn += 1
    
    if (reticle.active) {
      units.createSmoke(new Vector(reticle.x, reticle.y))
    }

    if (turn % TURNS_PER_COMPUTER_SHOT === 0) {
      var x = Math.round((Math.random() * 0.2 + 0.6) * width)
      var y = 0
      var target = new Vector(x, y)
      base2.fireAt(target)
      units.createSmoke(target)
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
