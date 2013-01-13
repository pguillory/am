Object.prototype.addEvent = function(eventName) {
  var object = this
  var handlers = []

  object['on' + eventName] = function(handler) {
    handlers.push(handler)
  }

  object['emit' + eventName] = function() {
    var self = this
    var eventArguments = arguments
    handlers.forEach(function(handler) {
      handler.apply(self, eventArguments)
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

  return new Position(x, y)
}
