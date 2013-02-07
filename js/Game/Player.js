function Player(id, color, direction) {
  var self = {}

  self.id = id
  self.color = color
  self.direction = direction
  self.gold = 0
  self.excavatorRequisitioned = false
  self.excavator = null

  self.addEvent('GoldChanged')

  self.gainGold = function(amount) {
    self.gold += amount
    self.emitGoldChanged()
  }

  self.deductGold = function(amount) {
    // if (self.gold > amount) {
      self.gold -= amount
      self.emitGoldChanged()
      return true
    // } else {
    //   return false
    // }
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

  return self
}
