function soundPicker(choices) {
  var i = 0
  return function() {
    i += 1
    i %= choices.length
    var audio = choices[i]
    audio.currentTime = 0
    audio.play()
  }
}

var SOUNDS = {
  pistol: soundPicker([pistol1, pistol2, pistol3]),
  explosion: soundPicker([explosion1, explosion2, explosion3]),
}
