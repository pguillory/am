Math.seedRandom = function(seed) {
  var constant = Math.pow(2, 13) + 1
  var prime = 37
  var maximum = Math.pow(2, 50)

  Math.random = function() {
    seed *= constant
    seed += prime
    seed %= maximum
    return seed / maximum
  }
}


Object.prototype.method = function(methodName) {
  return this[methodName].bind(this)
}

Object.prototype.addEvent = function(eventName) {
  var handlers = []

  this['on' + eventName] = function(handler) {
    if (handler === undefined) {
      throw 'handler is undefined'
    }
    handlers.push(handler)
  }

  this['emit' + eventName] = function() {
    var instance = this
    var eventArguments = arguments
    handlers.forEach(function(handler) {
      handler.apply(instance, eventArguments)
    })
  }
}

HTMLCanvasElement.prototype.totalOffset = function() {
  var x = 0
  var y = 0
  var element = this

  do {
      x += element.offsetLeft - element.scrollLeft
      y += element.offsetTop - element.scrollTop
  } while (element = element.offsetParent)

  return {x: x, y: y}
}

Math.bresenham = function(x0, y0, x1, y1, callback) {
  var dx = Math.abs(x1 - x0)
  var dy = Math.abs(y1 - y0)
  var sx = (x0 < x1) ? 1 : -1
  var sy = (y0 < y1) ? 1 : -1
  var err = dx - dy

  while (1) {
    callback(x0, y0)
    if (x0 === x1 && y0 === y1) break
    var e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}
