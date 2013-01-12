function Canvas(width, height) {
  this.width = width
  this.height = height

  this.element = document.createElement('canvas')
  this.element.setAttribute('width', width)
  this.element.setAttribute('height', height)

  this.context = this.element.getContext('2d')
}

Canvas.prototype.createSprite = function(width, height) {
  var imageData = this.context.createImageData(width, height)
  return new Sprite(width, height, imageData)
}

Canvas.prototype.paintSprite = function(sprite, width, height) {
  this.context.putImageData(sprite.imageData, width, height)
  // var imageData = this.context.createImageData(width, height)
  // return new Sprite(width, height, imageData)
}

Canvas.prototype.scaleBy = function(scale) {
  return new Canvas(this.width * scale, this.height * scale)
}
