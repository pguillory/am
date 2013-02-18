function Keyboard() {
  var self = {}

  var keys = []

  keys[16] = 'Shift'
  keys[17] = 'Control'
  keys[18] = 'Alt'
  keys[27] = 'Escape'
  keys[32] = 'Space'
  keys[224] = 'Command'

  for (var i = 0; i <= 26; i++) {
    keys[65 + i] = keys[97 + i] = String.fromCharCode(65 + i)
  }

  var keypress = []
  var keydown = []
  var keyup = []
  var keychange = []

  keys.forEach(function(name, code) {
    if (self['emit' + name] === undefined) {
      self.addEvent(name)
      self.addEvent(name + 'Down')
      self.addEvent(name + 'Up')
      self.addEvent(name + 'Change')
    }

    keypress[code]  = self['emit' + name           ].bind(self)
    keydown[code]   = self['emit' + name + 'Down'  ].bind(self)
    keyup[code]     = self['emit' + name + 'Up'    ].bind(self)
    keychange[code] = self['emit' + name + 'Change'].bind(self)
  })

  $(window).on('keypress', function(event) {
    if (keypress[event.charCode]) {
      keypress[event.charCode]()
    }
  })

  $(window).on('keyup', function(event) {
    if (keyup[event.keyCode]) {
      keyup[event.keyCode]()
      keychange[event.keyCode](false)
    }
  })

  $(window).on('keydown', function(event) {
    if (keydown[event.keyCode]) {
      keydown[event.keyCode]()
      keychange[event.keyCode](true)
    }
  })

  return self
}
