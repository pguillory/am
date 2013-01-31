function Controller(player, base) {
  this.player = player
  this.base = base
  this.commands = []
  this.reticle = base.reticle
  this.excavator = null
  this.chopper = null
  this.plane = null

  units.onExcavatorSpawned(function(excavator) {
    if (this.player == excavator.player) {
      this.excavator = excavator
    }
  }.bind(this))

  units.onExcavatorDied(function(excavator) {
    if (this.excavator == excavator) {
      this.excavator = null
    }
  }.bind(this))

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

Controller.prototype.excavate = function() {
  if (this.excavator) {
    this.excavator.activate()
  } else {
    this.player.excavatorRequisitioned = true
  }
}

Controller.prototype.requestChopper = function() {
  if (this.chopper) {
    this.chopper.activate()
  } else {
    this.chopper = units.launchChopper(this.player, 0, RIGHT)
    this.player.deductGold(CHOPPER_VALUE + FUEL_SURCHARGE)
  }
}
