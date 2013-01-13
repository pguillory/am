function Display(width, height, scale, terrain, players, units, bases) {
  var self = {}

  var WHITE = new Color(255, 255, 255)
  var CLEAR = new Color(0, 0, 0, 0)

  var TERRAIN_COLOR = [
    new Color(200, 200, 255),
    new Color(145, 122, 92),
    new Color(135, 112, 82),
  ]

  var PLAYER_COLOR = [
    new Color(200, 50, 50),
    new Color(50, 50, 200),
    new Color(50, 200, 50),
  ]

  var mainCanvas = new Canvas(width, height)
  var scaledCanvas = mainCanvas.scaleBy(scale)

  self.addEvent('Click')
  mainCanvas.onClick(self.emitClick)

  var terrainCanvas = (function(canvas) {
    function draw(x, y, material) {
      canvas.setPixel(x, y, TERRAIN_COLOR[material] || WHITE)
    }
    terrain.forEach(draw)
    terrain.onChanged(draw)
    return canvas
  })(new Canvas(width, height))

  var unitCanvas = new Canvas(width, height)
  
  function drawBase(base) {
    base.position.tap(function(x, y) {
      for (var dy = -3; dy <= 0; dy++) {
        for (var dx = -3; dx < 3; dx++) {
          unitCanvas.setPixel(x + dx, y + dy, PLAYER_COLOR[base.player.id])
        }
      }
    })
  }
  
  function drawTroop(troop) {
    var color = PLAYER_COLOR[troop.player.id]
    troop.position.tap(function(x, y) {
      unitCanvas.setPixel(x, y, color)
      unitCanvas.setPixel(x, y - 1, color)
    })
  }
  
  function drawProjectile(projectile) {
    projectile.lastPosition.round().tap(function(x1, y1) {
      projectile.position.round().tap(function(x0, y0) {
        unitCanvas.drawStreak(x0, y0, x1, y1, WHITE)
      })
    })
  }

  self.draw = function() {
    // drawTerrain()

    terrainCanvas.paint()
    mainCanvas.draw(terrainCanvas, 0, 0)

    units.forEachBase(drawBase)
    units.forEachTroop(drawTroop)
    units.forEachProjectile(drawProjectile)
    unitCanvas.paint()
    mainCanvas.draw(unitCanvas, 0, 0)
    unitCanvas.clear()

    scaledCanvas.paint()
  }

  self.attach = function(container) {
    $(scaledCanvas.element).click(function(event) {
      event.preventDefault()
      var offset = this.totalOffset()
      var x = event.pageX - offset.x
      var y = event.pageY - offset.y
      scaledCanvas.emitClick(x, y)
    })

    container.appendChild(scaledCanvas.element)
  }

  return self
}
