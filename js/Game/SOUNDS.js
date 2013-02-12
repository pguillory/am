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

return {
  // credit: soundPicker([credit]),
  // explosion_big: soundPicker([explosion_big]),
  // explosion_small: soundPicker([explosion_small]),
  // hurt: soundPicker([hurt]),
  // shoot: soundPicker([shoot]),
  // drill: soundPicker([drill]),
}
