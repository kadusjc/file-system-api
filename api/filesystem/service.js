'use strict'

const mongoose = require('mongoose'))
  , mongodb = mongoose.mongodb
  , fs = require('fs')
  , log = require('../../lib/log')

const Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo

let conn = mongoose.connection
let gfs = undefined;

conn.once('open', function (err) {
	if(err) log.error('Error on opening mongoose connection', err)
  gfs = Grid(conn.db);
}

function isValid(options) {
	if (!options) {
		log.error('empty or invalid options')
		return false
	}
	if (!options.id && !options.filename) {
		log.error('file without identifier')
		return false
	}
	return true
}

exports.create = function(options, file) {
	if (!isValid(options)) {
		return log.error('persist: empty or invalid options');
		return;
	}
	return gfs.createWriteStream(options);//function(err, writestream)
}

exports.read = function(options) {
	if (!isValid(options)) return log.error('read: empty or invalid options')
	return gfs.createReadStream(options);//function(err, readstream)
}

exports.remove = function(options) {
	if(!isValid(options)) {
		log.error('remove: empty or invalid options');
		return;
	}
	return gfs.remove(options);//function(err, result)
}

exports.exists = function(options) {
	if(!isValid(options)) {
		log.error('remove: empty or invalid options');
		return;
	}
	return gfs.exists(options);//function(err, found)
}