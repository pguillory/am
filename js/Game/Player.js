function Player(id, color, direction) {
  var self = {}

  self.id = id
  self.color = color
  self.direction = direction
  self.gold = 0
  self.excavatorRequisitioned = false
  self.excavator = null
  self.chopperRequisitioned = false
  self.chopper = null
  self.bomberRequisitioned = false
  self.plane = null

  self.addEvent('GoldChanged')

  self.gainGold = function(amount) {
    self.gold += amount
    self.emitGoldChanged()
  }

  self.deductGold = function(amount) {
    self.gold -= amount
    self.emitGoldChanged()
  }

  self.toString = function() {
    return 'Player(' + self.id + ', ' + self.gold + 'g)'
  }

  self.excavate = function() {
    if (self.excavator) {
      self.excavator.activate()
    } else {
      self.excavatorRequisitioned = true
    }
  }

  self.requestChopper = function() {
    if (self.chopper) {
      self.chopper.activate()
    } else {
      self.chopperRequisitioned = true
    }
  }

  self.requestBomber = function() {
    if (self.plane) {
      self.plane.activate()
    } else {
      self.bomberRequisitioned = true
    }
  }

  self.requestTransport = function() {
    if (self.plane) {
      self.plane.activate()
    } else {
      self.transportRequisitioned = true
    }
  }

  self.requestGunship = function() {
    if (self.plane) {
      self.plane.activate()
    } else {
      self.gunshipRequisitioned = true
    }
  }

  return self
}
