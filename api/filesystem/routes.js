'use strict'

const express = require('express')
  , mongoose = require('mongoose')
  , gfs = require('../../lib/gridfs')
  , router  = express.Router()

function options(fileId, req) {
  return {
    _id: fileId,
    filename: req.query.name,
    mode: 'w',
    content_type: req.query.type,
    metadata: {
      uploadedBy: req.query.user,
    }
  }
}

router.
  post('/', (req, res) => {

    let fileId = new mongoose.Types.ObjectId()
    let writestream = gfs.createWriteStream(options(fileId, req))
    writestream.on('close', () => {
      return res.status(200).json({fileId: fileId.toString()})
    });
    writestream.on('error', (err) => {
      return res.status(500).json({err: err})
    });
    req.pipe(writestream)

  }).

  get('/', (req, res) => {

    let fileId = mongoose.Types.ObjectId(req.query.id)
    gfs.files.findOne({ _id: fileId}).toArray( function (err, file) {
      res.contentType(file.contentType)
      gfs.createReadStream({_id: fileId}).pipe(res)
    })
  }).

  delete('/:id', (req, res) => {

    var options = { _id: mongoose.Types.ObjectId(req.params.id) }
    gfs.remove(options, (err) => {
      if(err) {
        throw(422, err)
      }
      return res.status(200)
        .json({message: fileId+' deleted successfully'})
    })

  })

module.exports = router

