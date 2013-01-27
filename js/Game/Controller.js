function Controller(player, base) {
  this.player = player
  this.base = base
  this.commands = []
  this.reticle = base.reticle
  this.excavator = null
  this.chopper = null
  this.plane = null
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
