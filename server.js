var fs = require('fs')
var path = require('path')
var async = require('async')
var express = require('express')

var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
server.listen(80)





app.use(express.logger())

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/views/index.html')
})

app.use(express.static('public'))

app.get('/js/Game.js', function(request, response) {
  var source = loadFile('js/Game.js')
  response.type('application/javascript');
  response.send(source)
})

function loadFile(filename) {
  switch (path.extname(filename)) {
    case '.js':
      return loadJavascriptFile(filename)
  }
  return ''
}

function loadJavascriptFile(filename) {
  var basename = path.basename(filename, path.extname(filename))
  var dirname = path.join(path.dirname(filename), basename)

  s = ''
  s += "\n"
  s += "/**********************************************************************/\n"
  s += "/*  /" + filename + " \n"
  s += "/**********************************************************************/\n"
  s += "var " + basename + ";\n"
  s += "function define_" + basename + "() {\n"
  s += "if (" + basename + ") return;\n"
  s += basename + " = (function(" + basename + ", undefined){\n"

  if (fs.existsSync(dirname) && fs.statSync(dirname).isDirectory()) {
    var files = fs.readdirSync(dirname)
    files.forEach(function(file) {
      file = path.join(dirname, file)
      // console.log('file', file)
      s += loadFile(file)
    })
  }

  s += fs.readFileSync(filename, 'utf8')

  s += "    ;return " + basename + "\n"
  s += "})();\n"
  s += "}\n"
  s += "define_" + basename + "();\n\n"

  return s
}







var standby = null

io.sockets.on('connection', function(socket) {
  if (standby) {
    standby.removeAllListeners('disconnect')
    createGame([standby, socket])
    standby = null
  } else {
    standby = socket
    standby.on('disconnect', function() {
      standby = null
    })
  }
})

function createGame(sockets) {
  var seed = Math.floor(Math.random() * Math.pow(2, 50))
  
  sockets.forEach(function(socket, id) {
    socket.emit('initialize', id, seed)

    socket.on('turn', function(commands) {
      sockets[1 - id].emit('turn', commands)
    })
  })
}
