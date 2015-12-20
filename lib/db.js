'use strict'

const mongoose = require('mongoose')
  , config = require('../config/db')
  , log = require('../lib/log')
  , dbUri = config[process.env.NODE_ENV]

mongoose.connect(dbUri)

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0)
  })
})

mongoose.connection.on('error', err => log.error(`Mongoose connection error: ${err}`))

module.exports = mongoose

