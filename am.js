var WHITE = [255, 255, 255]

var PLAYER_COLORS = [
  [200, 50, 50],
  [50, 50, 200]
]

AIR = 0
DIRT = 1
ROCK = 2

TERRAIN_COLOR = []
TERRAIN_COLOR[AIR] = [200, 200, 255]
TERRAIN_COLOR[DIRT] = [145, 122, 92]
TERRAIN_COLOR[ROCK] = [100, 100, 100]


/*
 * Grid
 */
function Grid(width, height) {
  var self = {}

  var values = []

  self.get = function get(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return null
    }
    return values[y * width + x]
  }

  self.set = function set(x, y, value) {
    values[y * width + x] = value
  }

  self.forEach = function forEach(callback) {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        callback(x, y, get(x, y))
      }
    }
  }

  self.fill = function fill(value) {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        values[y * width + x] = value
      }
    }
  }

  self.swap = function(x1, y1, x2, y2) {
    var i1 = y1 * width + x1
    var i2 = y2 * width + x2
    var t = values[i1]
    values[i1] = values[i2]
    values[i2] = t
  }

  return self
}

/*
 * Terrain
 */
function Terrain(width, height) {
  var self = Grid(width, height)
  
  self.increment = function() {
    for (var y = height - 1; y >= 0; y--) {
      for (var x = width - 1; x >= 0; x--) {
        switch (self.get(x, y)) {
          case AIR:
            if (self.get(x, y - 1) == DIRT) {
              self.swap(x, y, x, y - 1)
            }
          break
        }
      }
    }
  }

  return self
}

/*
 * Player
 */
function Player(id, color) {
  this.id = id
  this.color = color
}

Player.prototype.toString = function() {
  return 'Player(' + this.id + ')'
}

/*
 * Players
 */
function Players() {
  var self = {}

  var members = []

  self.reset = function() {
    members = []
  }

  self.create = function(color) {
    var player = new Player(members.length, color)
    members.push(player)
    return player
  }

  self.forEach = function(callback) {
    members.forEach(callback)
    // for (var id = 0; id < members.length; id++) {
    //   callback(members[id])
    // }
  }

  return self
}

/*
 * Troop
 */
function Troop(player, position, velocity) {
  this.player = player
  this.position = position.clone()
  this.velocity = velocity
  this.hp = 1
}

Troop.prototype.collidesWithTroop = function(defender) {
  return this.position.collidesWith(defender.position)
}

/*
 * Units
 */

function Units(terrain, players) {
  var self = {}

  var troops = []

  self.createTroop = function(player, position, velocity) {
    troops.push(new Troop(player, position, velocity))
  }

  self.increment = function() {
    troops.forEach(function(troop) {
      var attacks = 1

      troops.forEach(function(defender) {
        if (attacks > 0 &&
            troop.player !== defender.player &&
            troop.collidesWithTroop(defender) &&
            defender.hp > 0) {
          attacks -= 1
          defender.hp -= 1
        }
      })

      if (attacks > 0) {
        troop.position.add(troop.velocity)
      }
    })

    troops = troops.filter(function(troop) {
      return (troop.hp > 0)
    })
  }

  self.forEachTroop = function(callback) {
    troops.forEach(callback)
  }

  return self
}


/*
 * Projectile
 */
function Projectile(position, velocity) {
  this.position = position.clone()
  this.lastPosition = position.clone()
  this.velocity = velocity.clone()
  this.hp = 1
}

Projectile.prototype.kill = function() {
  this.hp = 0
}

Projectile.prototype.alive = function() {
  return (this.hp > 0)
}

Projectile.prototype.toString = function() {
  return 'Projectile(' + this.position.toString() + ', ' + this.lastPosition.toString() + ', ' + this.velocity.toString() + ')'
}

function Projectiles(terrain) {
  var self = {}
  
  var projectiles = []
  
  self.create = function(position, velocity) {
    var projectile = new Projectile(position, velocity)
    projectiles.push(projectile)
    return projectile
  }
  
  self.increment = function() {
    projectiles.forEach(function(projectile) {
      projectile.lastPosition = projectile.position
      projectile.position = projectile.position.plus(projectile.velocity).round()
      projectile.velocity.y += 1

      var material = terrain.get(projectile.position.x, projectile.position.y)
      if (material != AIR) {
        projectile.kill()
      }
    })

    projectiles = projectiles.filter(function(projectile) {
      return projectile.alive()
    })
  }

  self.forEach = function(callback) {
    projectiles.forEach(callback)
  }

  return self
}

/*
 * Base
 */
function Base(player, position, velocity) {
  this.player = player
  this.position = position
  this.velocity = velocity
  this.timeToTroop = 0
}

/*
 * Bases
 */
function Bases(units, projectiles) {
  var self = {}

  var bases = []

  self.create = function(player, position, velocity) {
    bases.push(new Base(player, position, velocity))
  }
  
  self.first = function() {
    return bases[0]
  }

  self.increment = function() {
    self.forEach(function(base) {
      base.timeToTroop += 1
      base.timeToTroop %= 10
      if (base.timeToTroop == 1) {
        units.createTroop(base.player, base.position, base.velocity)
      }
    })
  }

  self.fireAt = function(base, target) {
    var velocity = target.minus(base.position).times(0.17).wiggle(1.0)
    // .constrainedToMagnitude(10)
    projectiles.create(base.position, velocity)
  }

  self.forEach = function(callback) {
    bases.forEach(callback)
  }

  return self
}

/*
 * Position
 */
function Position(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.tap = function(callback) {
  return callback(this.x, this.y)
}

Position.prototype.clone = function() {
  return new Position(this.x, this.y)
}

Position.prototype.add = function(position) {
  this.x += position.x
  this.y += position.y
}

Position.prototype.subtract = function(position) {
  this.x -= position.x
  this.y -= position.y
}

Position.prototype.plus = function(position) {
  return new Position(this.x + position.x, this.y + position.y)
}

Position.prototype.minus = function(position) {
  return new Position(this.x - position.x, this.y - position.y)
}

Position.prototype.times = function(scale) {
  return new Position(this.x * scale, this.y * scale)
}

Position.prototype.wiggle = function(scale) {
  var x = this.x + Math.random() * scale - scale / 2
  var y = this.y + Math.random() * scale - scale / 2
  return new Position(x, y)
}

Position.prototype.round = function() {
  return new Position(Math.round(this.x), Math.round(this.y))
}

Position.prototype.collidesWith = function(position) {
  return this.x === position.x
}

Position.prototype.toString = function() {
  return '<' + this.x + ', ' + this.y + '>'
}

// Position.prototype.lineTo = function(otherPosition, callback) {
//   callback(this.x, this.y)
//   callback(otherPosition.x, otherPosition.y)
// }

/*
 * Display
 */
function Display(width, height, scale, terrain, players, units, bases, projectiles) {
  var self = {}

  function createCanvas(width, height) {
    var canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    return canvas
  }
  var drawCanvas = createCanvas(width, height)
  var drawContext = drawCanvas.getContext('2d')
  var outputCanvas = createCanvas(width * scale, height * scale)
  var outputContext = outputCanvas.getContext('2d')
  outputContext.scale(scale, scale)

  $(outputCanvas).click(function(event) {
    event.preventDefault()
    var x = Math.floor((event.clientX - outputCanvas.offsetLeft) / scale)
    var y = Math.floor((event.clientY - outputCanvas.offsetTop) / scale)
    self.clicked(x, y)
  })

  self.clicked = function(x, y) {
    // no-op
  }

  var data = drawContext.createImageData(width, height)

  function drawPixel(x, y, color) {
    var i = (y * data.width + x) * 4
    data.data[i + 0] = color[0]
    data.data[i + 1] = color[1]
    data.data[i + 2] = color[2]
    data.data[i + 3] = color[3] || 255
  }

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

  function drawStreak(x0, y0, x1, y1, color) {
    color[3] = 255

    bresenham(x0, y0, x1, y1, function(x, y) {
      color[3] -= 20
      drawPixel(x, y, color)
    })
  }

  function drawTerrain() {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var material = terrain.get(x, y)
        drawPixel(x, y, TERRAIN_COLOR[material])
      }
    }
  }

  function drawBase(base) {
    base.position.tap(function(x, y) {
      for (var dy = -3; dy <= 0; dy++) {
        for (var dx = -3; dx < 3; dx++) {
          drawPixel(x + dx, y + dy, base.player.color)
        }
      }
    })
  }

  function drawTroop(troop) {
    troop.position.tap(function(x, y) {
      drawPixel(x, y, troop.player.color)
      drawPixel(x, y - 1, troop.player.color)
    })
  }

  function drawProjectile(projectile) {
    projectile.lastPosition.tap(function(x1, y1) {
      projectile.position.tap(function(x0, y0) {
        drawStreak(x0, y0, x1, y1, WHITE)
      })
    })
  }

  self.draw = function() {
    drawTerrain()
    bases.forEach(drawBase)
    units.forEachTroop(drawTroop)
    projectiles.forEach(drawProjectile)

    drawContext.putImageData(data, 0, 0)
    outputContext.drawImage(drawCanvas, 0, 0)
  }

  self.attach = function(container) {
    container.appendChild(outputCanvas)
  }

  return self
}

/*
 * Game
 */
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
    var player1 = players.create(PLAYER_COLORS[0])
    bases.create(player1, new Position(5, height / 2 - 1), new Position(1, 0))

    var player2 = players.create(PLAYER_COLORS[1])
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
