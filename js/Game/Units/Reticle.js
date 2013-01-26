var LASER_COLOR = new Color(255, 0, 0, 50)

function Reticle(position) {
  this.position = position
  this.target = new Vector(0, 0)
  this.lase = false
  this.fire = false
}

Reticle.prototype.release = function() {
  this.lase = false
  this.fire = false
}

Reticle.prototype.draw = function(canvas) {
  if (!this.lase) return

  var p = this.position.clone()
  // p.y -= 3
  var d = this.velocity
  // d.y -= 3
  var visible = true
  var done = false
  for (var i = 0; i < 50; i++) {
    if (done) break
    p2 = p.plus(d)
    pr = p.round()
    pr2 = p2.round()
    // console.log('points ' + pr + ' ' + pr2)
    var first = true
    Math.bresenham(pr.x, pr.y, pr2.x, pr2.y, function(x, y) {
      if (x < 0 || x >= width) {
        done = true
        return
      }
      if (done) return
      if (first) {
        first = false
        return
      }
      if (visible) {
        canvas.setPixel(x, y, LASER_COLOR)
      }
      visible = !visible
    })
    d.y += 1
    p = p2
  }
}
