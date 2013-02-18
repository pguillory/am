var SCALE = 4

var WHITE = new Color(255, 255, 255)

function Display(width, height, terrain, players, units) {
  var self = {}

  var mainCanvas = new Canvas(width, height)
  var scaledCanvas = mainCanvas.scaleBy(SCALE)

  self.addEvent('Click')
  mainCanvas.onClick(self.emitClick)

  var terrainCanvas = new Canvas(width, height)

  function draw(x, y, material) {
    terrainCanvas.setPixel(x, y, TERRAIN_COLOR[material])
  }
  terrain.forEach(draw)
  terrain.onChanged(draw)

  var unitCanvas = new Canvas(width, height)

  self.draw = function() {
    terrainCanvas.paint()
    mainCanvas.draw(terrainCanvas, 0, 0)

    units.forEach(function(unit) {
      unit.draw(unitCanvas)
    })
    unitCanvas.paint()

    mainCanvas.draw(unitCanvas, 0, 0)
    unitCanvas.clear()

    scaledCanvas.paint()
  }

  self.attach = function() {
    $(scaledCanvas.element).click(function(event) {
      event.preventDefault()
      scaledCanvas.emitClick(event.pageX, event.pageY)
    })

    document.body.appendChild(scaledCanvas.element)
  }

  return self
}
