function Player(id, color, direction) {
  this.id = id
  this.color = color
  this.direction = direction
  this.gold = 0
}

Player.prototype.addEvent('GoldChanged')

Player.prototype.gainGold = function(amount) {
  this.gold += amount
  this.emitGoldChanged()
}

Player.prototype.deductGold = function(amount) {
  // if (this.gold > amount) {
    this.gold -= amount
    this.emitGoldChanged()
    return true
  // } else {
  //   return false
  // }
}

Player.prototype.toString = function() {
  return 'Player(' + this.id + ', ' + this.gold + 'g)'
}
