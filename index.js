'use strict'

const express = require('express')
const compress = require('compression')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

const APIHome = require('./api/home/routes')
const APIFile = require('./api/file-system/routes')

app.use(compress())
app.use(logger('combined'))
app.use(helmet())
app.use('*', cors())
app.use('/', APIHome)
app.use('/v1/file', APIFile)
app.use(express.static(`${__dirname}/public`))

module.exports = app
