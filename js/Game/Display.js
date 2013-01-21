function Display(width, height, scale, terrain, players, units, reticle, base1) {
  var self = {}

  var WHITE = new Color(255, 255, 255)
  var RED = new Color(255, 0, 0)
  var GREEN = new Color(0, 255, 0)
  var BLUE = new Color(0, 0, 255)

  var LASER_COLOR = new Color(255, 0, 0, 50)
  var PARACHUTE_COLOR = new Color(255, 255, 255)
  var PARACHUTE_CORD_COLOR = new Color(255, 255, 255, 100)

  var PLAYER_COLOR = [
    new Color(200, 50, 50),
    new Color(50, 150, 50),
    new Color(50, 50, 200),
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
  
  // function drawBase(base) {
  //   base.position.tap(function(x, y) {
  //     for (var dy = -3; dy <= 0; dy++) {
  //       for (var dx = -3; dx <= 3; dx++) {
  //         unitCanvas.setPixel(x + dx, y + dy, base.player.color)
  //       }
  //     }
  //   })
  // }

  // var pallette = Pallette.load({
  //   W: new Color(255, 255, 255)
  //   P: [null, null, null, 255],
  // })
  // 
  // var troopSprite = pallette.draw([
  //   'P',
  //   'P',
  // ], [1, 0])
  // 
  // var paratroopSprite = pallette.draw([
  //   ' W ',
  //   'WWW',
  //   'w w',
  //   ' P ',
  //   ' P ',
  // ], [4, 1])
  
  function drawTroop(troop) {
    var color = troop.player.color
    troop.position.tap(function(x, y) {
      unitCanvas.setPixel(x, y, color)
      unitCanvas.setPixel(x, y - 1, color)
    })
  }
  
  function drawParatroop(paratroop) {
    drawTroop(paratroop)

    paratroop.position.tap(function(x, y) {
      unitCanvas.setPixel(x    , y - 4, PARACHUTE_COLOR)
      unitCanvas.setPixel(x - 1, y - 3, PARACHUTE_COLOR)
      unitCanvas.setPixel(x    , y - 3, PARACHUTE_COLOR)
      unitCanvas.setPixel(x + 1, y - 3, PARACHUTE_COLOR)
      unitCanvas.setPixel(x - 1, y - 2, PARACHUTE_CORD_COLOR)
      unitCanvas.setPixel(x + 1, y - 2, PARACHUTE_CORD_COLOR)
    })
  }

  // function drawLooter(looter) {
  //   drawTroop(looter)
  // 
  //   var color = TERRAIN_COLOR[looter.material]
  //   looter.position.tap(function(x, y) {
  //     unitCanvas.setPixel(x, y - 2, color)
  //   })
  // }

  function drawBomber(bomber) {
    var color = bomber.player.color
    var direction = bomber.player.direction
    bomber.position.tap(function(x, y) {
      unitCanvas.setPixel(x, y, color)
      unitCanvas.setPixel(x - direction, y, color)
      unitCanvas.setPixel(x - direction, y - 1, color)
      unitCanvas.setPixel(x + direction, y, color)
    })
  }

  function drawChopper(chopper) {
    var color = chopper.player.color
    var color2 = color.clone()
    color2.alpha /= 2

    chopper.position.tap(function(x, y) {
      unitCanvas.setPixel(x, y, color)
      unitCanvas.setPixel(x - 1, y, color)
      unitCanvas.setPixel(x - 2, y, color)
      unitCanvas.setPixel(x + 1, y, color)
      unitCanvas.setPixel(x, y - 1, color)
      unitCanvas.setPixel(x, y - 2, color2)
      if (chopper.rotor > 0) {
        unitCanvas.setPixel(x - 1, y - 2, color2)
        unitCanvas.setPixel(x - 2, y - 2, color2)
      } else {
        unitCanvas.setPixel(x + 1, y - 2, color2)
        unitCanvas.setPixel(x + 2, y - 2, color2)
      }
    })
  }

  // function drawSmoke(smoke) {
  //   var rgb = Math.floor(Math.random() * 100) + 150
  //   var a = Math.floor(Math.random() * 255)
  //   var color = new Color(rgb, rgb, rgb, a)
  //   // SMOKE_COLOR.alpha = Math.floor(Math.random() * 255)
  //   smoke.position.tap(function(x, y) {
  //     unitCanvas.setPixel(x, y, color)
  //   })
  // }

  units.onProjectileMoved(function(p0, p1) {
    unitCanvas.drawStreak(p1.x, p1.y, p0.x, p0.y, WHITE)
  })
  
  function drawUnit(unit) {
    unit.draw(unitCanvas)
  }

  function drawReticle() {
    var p = base1.position.clone()
    p.y -= 3
    var d = new Vector(reticle.x, reticle.y).minus(p).times(0.17)
    d.y -= 3
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
        if (terrain.get(x, y) > AIR) {
          done = true
          return
        }
        if (visible) {
          unitCanvas.setPixel(x, y, LASER_COLOR)
        }
        visible = !visible
      })
      d.y += 1
      p = p2
    //   break
    }
  }

  self.draw = function() {
    terrainCanvas.paint()
    mainCanvas.draw(terrainCanvas, 0, 0)

    units.forEachTroop(drawUnit)

    // units.forEachLooter(function(troop) {
    //   troop.draw(unitCanvas)
    // })

    units.forEachBase(drawUnit)
    units.forEachBomber(drawBomber)
    units.forEachChopper(drawChopper)
    units.forEachSmoke(function(smoke) {
      smoke.draw(unitCanvas)
    })
    units.forEachParatroop(drawParatroop)

    if (reticle.active) {
      drawReticle()
    }

    unitCanvas.paint()
    mainCanvas.draw(unitCanvas, 0, 0)
    unitCanvas.clear()

    scaledCanvas.paint()
  }

  self.attach = function() {
    $(scaledCanvas.element).click(function(event) {
      event.preventDefault()
      // var offset = this.totalOffset()
      var x = event.pageX //- offset.x
      var y = event.pageY //- offset.y
      scaledCanvas.emitClick(x, y)
    })
    .on('touchstart', function(event) {
      event.preventDefault()

      var touch = event.touches[0]
      // var offset = this.totalOffset()
      var x = event.pageX //- offset.x
      var y = event.pageY //- offset.y
      scaledCanvas.emitClick(x, y)
    })

    document.body.appendChild(scaledCanvas.element)
  }

  return self
}
