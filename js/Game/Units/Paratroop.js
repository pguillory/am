var PARACHUTE_COLOR = new Color(255, 255, 255)
var PARACHUTE_CORD_COLOR = new Color(255, 255, 255, 100)

function Paratroop(player, position) {
  this.player = player
  this.position = position.clone()
  this.hp = 1
}

Paratroop.prototype.addEvent('Touchdown')

Paratroop.prototype.move = function(terrain) {
  var r = Math.random()
  if (r < 0.1) {
    this.position.x -= 1
  } else if (r < 0.2) {
    this.position.x += 1
  }
  if (terrain.get(this.position.x, this.position.y + 1) === AIR) {
    this.position.y += 1
    return true
  } else {
    this.emitTouchdown()
    return false
  }
}

Paratroop.prototype.draw = function(canvas) {
  Troop.prototype.draw.call(this, canvas)

  this.position.tap(function(x, y) {
    canvas.setPixel(x    , y - 4, PARACHUTE_COLOR)
    canvas.setPixel(x - 1, y - 3, PARACHUTE_COLOR)
    canvas.setPixel(x    , y - 3, PARACHUTE_COLOR)
    canvas.setPixel(x + 1, y - 3, PARACHUTE_COLOR)
    canvas.setPixel(x - 1, y - 2, PARACHUTE_CORD_COLOR)
    canvas.setPixel(x + 1, y - 2, PARACHUTE_CORD_COLOR)
  })
}
