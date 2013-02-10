function CommandBuffer(controller) {
  var self = {}

  var commands = []
  var buffer = []

  controller.onCommand(function(command) {
    commands.push(command)
  })

  self.cycle = function() {
    buffer.push(commands)
    commands = []
    return buffer.shift()
  }

  return self
}
