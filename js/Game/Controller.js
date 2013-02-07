function Controller(player, base) {
  this.player = player
  this.base = base
  this.commands = []
  this.reticle = base.reticle
  this.chopper = null
  this.plane = null

  units.onCrash(function(unit) {
    switch (unit) {
      case this.plane:
        this.plane = null
        this.reticle = this.base.reticle
        break
      case this.chopper:
        this.chopper = null
        break
    }
  }.bind(this))

  units.onEgress(function(unit) {
    switch (unit) {
      case this.plane:
        this.plane = null
        this.reticle = this.base.reticle
        break
      case this.chopper:
        this.chopper = null
        break
    }
  }.bind(this))
}

Controller.prototype.requestChopper = function() {
  if (this.chopper) {
    this.chopper.activate()
  } else {
    this.chopper = units.launchChopper(this.player, 0, RIGHT)
    this.player.deductGold(CHOPPER_VALUE + FUEL_SURCHARGE)
  }
}

Controller.prototype.aim = function(x, y) {
  this.reticle.target.x = x
  this.reticle.target.y = y
}

Controller.prototype.lase = function(state) {
  this.reticle.lase = state
}

Controller.prototype.fire = function(state) {
  this.reticle.fire = state
}
