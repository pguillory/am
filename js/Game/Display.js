var WHITE = new Color(255, 255, 255)

var TERRAIN_COLOR = [
  new Color(200, 200, 255),
  new Color(145, 122, 92),
  new Color(135, 112, 82),
]

HTMLCanvasElement.prototype.totalOffset = function() {
  var x = 0
  var y = 0
  var element = this

  do {
      x += element.offsetLeft - element.scrollLeft
      y += element.offsetTop - element.scrollTop
  } while (element = element.offsetParent)

  return new Position(x, y)
}

function Display(width, height, scale, terrain, players, units, bases) {
  var self = {}

  var drawCanvas = new Canvas(width, height)
  var outputCanvas = drawCanvas.scaleBy(scale)

  var mainSprite = drawCanvas.createSprite(width, height)

  $(outputCanvas.element).click(function(event) {
    event.preventDefault()

    var offset = outputCanvas.element.totalOffset()
    var x = Math.floor((event.pageX - offset.x) / scale)
    var y = Math.floor((event.pageY - offset.y) / scale)
    self.clicked(x, y)
  })

  self.clicked = function(x, y) {}

  function drawTerrain() {
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var material = terrain.get(x, y)
        mainSprite.setPixel(x, y, TERRAIN_COLOR[material])
      }
    }
  }

  function drawBase(base) {
    base.position.tap(function(x, y) {
      for (var dy = -3; dy <= 0; dy++) {
        for (var dx = -3; dx < 3; dx++) {
          mainSprite.setPixel(x + dx, y + dy, base.player.color)
        }
      }
    })
  }

  function drawTroop(troop) {
    troop.position.tap(function(x, y) {
      mainSprite.setPixel(x, y, troop.player.color)
      mainSprite.setPixel(x, y - 1, troop.player.color)
    })
  }

  function drawProjectile(projectile) {
    projectile.lastPosition.round().tap(function(x1, y1) {
      projectile.position.round().tap(function(x0, y0) {
        mainSprite.drawStreak(x0, y0, x1, y1, WHITE)
      })
    })
  }

  self.draw = function() {
    drawTerrain()
    units.forEachBase(drawBase)
    units.forEachTroop(drawTroop)
    units.forEachProjectile(drawProjectile)
    drawCanvas.paintSprite(mainSprite, 0, 0)

    var data = drawCanvas.context.getImageData(0, 0, width, height)
    var data2 = outputCanvas.context.createImageData(width * scale, height * scale)

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        for (var o = 0; o < 4; o++) {
          var i = (y * data.width + x) * 4 + o
          for (var dy = 0; dy < scale; dy++) {
            for (var dx = 0; dx < scale; dx++) {
              var y2 = (y * scale) + dy
              var x2 = (x * scale) + dx
              var i2 = (y2 * data2.width + x2) * 4 + o
              data2.data[i2] = data.data[i]
            }
          }
        }
      }
    }

    outputCanvas.context.putImageData(data2, 0, 0)
  }

  self.attach = function(container) {
    container.appendChild(outputCanvas.element)
  }

  return self
}
