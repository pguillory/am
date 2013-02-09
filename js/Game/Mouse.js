function Mouse() {
  var self = {}

  self.addEvent('Move')
  self.addEvent('Click')

  self.bind = function($document) {
    $document.on('mousemove', function(event) {
      var x = Math.floor(event.pageX * width / event.target.clientWidth)
      var y = Math.floor(event.pageY * height / event.target.clientHeight)
      self.emitMove(x, y)
    })

    $document.on('click', function(event) {
      var x = Math.floor(event.pageX * width / event.target.clientWidth)
      var y = Math.floor(event.pageY * height / event.target.clientHeight)
      self.emitClick(x, y)
    })

    return self
  }

  return self
}
