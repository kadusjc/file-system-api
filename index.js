'use strict'

const express = require('express')
  , compress = require('compression')
  , logger = require('morgan')
  , cors = require('cors')
  , helmet = require('helmet')
  , APIHome = require('./api/home/routes')
  , APIFile = require('./api/file-system/routes')
  , app = express()

app.use(compress())
app.use(logger('combined'))
app.use(helmet())
app.use('*', cors())
app.use('/', APIHome)
app.use('/v1/file', APIFile)
app.use(express.static(`${__dirname}/public`))

module.exports = app
