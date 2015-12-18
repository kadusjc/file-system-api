'use strict'

const express = require('express')
  , mongoose = require('mongoose')
  , gfs = require('../../lib/gridfs')
  , router  = express.Router()

const options = (fileId, req) => {
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

  /**
   * @api {post} /v1/file Save new File into FileSystem returning its id
   * @apiGroup File
   * @apiSuccess {String} name File name
   * @apiSuccess {String} type contentType
   * @apiSuccess {String} user User correlated with this file (file creator for example)
   * @apiExample {json} Example usage:
   *    curl -X POST http://file-system-api/v1/file \
   *    -d 'name=Text.txt' \
   *    -d 'type=text/plain' \
   *    -d 'user=Kadu' \
   * @apiSuccess {json} Success
   *    HTTP/1.1 200 OK {id: 5674481b8796b87420683dd3 }
   * @apiErrorExample {json} Error
   *    HTTP/1.1 422 Unprocessable Entity
   */
  post('/', (req, res) => {
    let fileId = new mongoose.Types.ObjectId()
    let writestream = gfs.createWriteStream(options(fileId, req))

    writestream.on('finish', () => res.status(200).json({
      id: fileId.toString()
    }))

    writestream.on('error', (err) => res.sendStatus(422))
    req.pipe(writestream)
  }).

  /**
   * @api {get} /v1/file Retrieves a saved file inside file system by its id
   * @apiGroup File
   * @apiSuccess {String} id File id
   * @apiExample {json} Example usage:
   *    curl -X POST http://file-system-api/v1/file \
   *    -d 'id=5674481b8796b87420683dd3'
   * @apiSuccess {Object} File to download
   * @apiErrorExample {json} Error
   *    HTTP/1.1 422 Unprocessable Entity
   */
  get('/', (req, res) => {

    let fileId = mongoose.Types.ObjectId(req.query.id)
    gfs.files.findOne({ _id: fileId}, (err, file) => {
      res.contentType(file.contentType)
      gfs.createReadStream({_id: fileId})
        .pipe(res)
    })
  }).

  /**
   * @api {delete} /v1/file Remove a saved file inside file system by its id
   * @apiGroup File
   * @apiSuccess {String} id File id
   * @apiExample {json} Example usage:
   *    curl -X DELETE http://file-system-api/v1/file/5674481b8796b87420683dd3
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "message": "File 5674481b8796b87420683dd3 deleted successfully"
   *    }
   * @apiErrorExample {json} Error
   *    HTTP/1.1 422 Unprocessable Entity
   */
  delete('/:id', (req, res) => {
    let options = {_id: mongoose.Types.ObjectId(req.params.id)}
    gfs.remove(options, (err) => {
      if (err) return res.sendStatus(422)
      return res.status(200)
        .json({message: `File ${req.params.id} deleted successfully`})
    })

  })

module.exports = router