'use strict'

const GFSS = require('gridfs-stream')

const db = require('./db')

module.exports = () => GFSS(db.connection.db, db.mongo)
