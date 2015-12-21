'use strict'

const http = require('http')
  , app = require('../app')
  , port = process.env.PORT || 3005

require('../lib/db')

http.globalAgent.maxSockets = Infinity
http.createServer(app.callback())
app.listen(port)
console.log(`File System API - port ${port}`)
