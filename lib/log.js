'use strict'

const bunyan = require('bunyan')

module.exports = bunyan.createLogger({
  name: 'file-system-api'
})
