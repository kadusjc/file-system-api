'use strict'

var express = require('express')
  , compress = require('compression')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , helmet = require('helmet')
  , app = express()

app.use(compress())
app.use(logger('combined'))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('*', cors())
app.use('/v1/file', require('./api/filesystem/routes'))

app.use(express.static(__dirname + '/public'))

module.exports = app
