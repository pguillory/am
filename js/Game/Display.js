var WHITE = new Color(255, 255, 255)

var TERRAIN_COLOR = [
  new Color(200, 200, 255),
  new Color(145, 122, 92),
  new Color(100, 100, 100),
]

function createCanvas(width, height) {
  var canvas = document.createElement('canvas')
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  return canvas
}

function Display(width, height, scale, terrain, players, units, bases) {
  var self = {}

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
    data.data[i + 0] = color.red
    data.data[i + 1] = color.green
    data.data[i + 2] = color.blue
    data.data[i + 3] = color.alpha
  }

  function drawStreak(x0, y0, x1, y1, color) {
    color.alpha = 255

    bresenham(x0, y0, x1, y1, function(x, y) {
      color.alpha -= 20
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
    projectile.lastPosition.round().tap(function(x1, y1) {
      projectile.position.round().tap(function(x0, y0) {
        drawStreak(x0, y0, x1, y1, WHITE)
      })
    })
  }

  self.draw = function() {
    drawTerrain()
    units.forEachBase(drawBase)
    units.forEachTroop(drawTroop)
    units.forEachProjectile(drawProjectile)

    drawContext.putImageData(data, 0, 0)
    outputContext.drawImage(drawCanvas, 0, 0)
  }

  self.attach = function(container) {
    container.appendChild(outputCanvas)
  }

  return self
}
