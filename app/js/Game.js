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

var TURN_INTERVAL_MS = 100

var width = 160
var height = 100

function Game(pacecar, controller) {
  var self = {}

  var terrain = new Terrain(width, height)
  terrain.initialize()

  var players = []
  function createPlayer(options) {
    var player = new Player(players.length, options.color, options.direction, options.x)
    players.push(player)
  }
  createPlayer({ color: new Color(200, 50, 50), direction: RIGHT, x: 0         })
  createPlayer({ color: new Color(50, 50, 150), direction: LEFT,  x: width - 1 })

  var units = new Units(terrain, players)
  units.initialize()

  var display = new Display(width, height, terrain, players, units)
  display.attach()

  pacecar.onTurn(function(commands) {
    commands.forEach(function(command) {
      players[command.player_id].method(command.method).apply(null, command.args)
    })
    terrain.move()
    units.move()
    display.draw()
  })

  var mouse = new Mouse()

  mouse.onMove(controller.aim)

  var keyboard = new Keyboard()

  keyboard.onShiftChange(controller.lase)
  keyboard.onControlChange(controller.fire)
  // keyboard.onSpace(pacecar.togglePause)
  // keyboard.onEscape(pacecar.togglePause)
  keyboard.onB(controller.requestBomber)
  // keyboard.onP(pacecar.togglePause)
  keyboard.onC(controller.requestChopper)
  keyboard.onG(controller.requestGunship)
  keyboard.onT(controller.requestTransport)
  keyboard.onS(terrain.hardScroll)
  keyboard.onX(controller.excavate)

  players.forEach(function(player) {
    var goldDisplay = $('<div class="gold-counter player' + player.id + '">').appendTo(document.body)
    player.onGoldChanged(function() { goldDisplay.text(player.gold) })
    player.emitGoldChanged()
  })
}

var server = new RemoteServer()

server.onInitialize(function(player_id, seed) {
  console.log('initialize', player_id, seed)
  Math.seedRandom(seed)

  var controller = new Controller(player_id)
  var commandBuffer = new CommandBuffer(controller)
  var pacecar = new Pacecar(commandBuffer, server)
  Game(pacecar, controller)
  pacecar.start()
})
