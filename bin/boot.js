'use strict'

const http = require('http')
  , app = require('../app')
  , port = process.env.PORT || 3005

require('../lib/db')

var listenServer = function() {
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
}

var onListening = function() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  log.info('Listening on', bind)
}

app.listen(port)
console.log(`File System API - port ${port}`)
