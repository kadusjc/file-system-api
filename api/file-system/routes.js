'use strict'

const express = require('express')
  , mongoose = require('mongoose')
  , GridFS = require('../../lib/gridfs')
  , router  = express.Router()
  , gfs = GridFS()

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
   *    -d 'metadata={
   *         "userId": "123456"
   *       }'
   * @apiSuccess {json} Success
   *    HTTP/1.1 200 OK {id: 5674481b8796b87420683dd3 }
   * @apiErrorExample {json} Error
   *    HTTP/1.1 422 Unprocessable Entity
   */
  post('/', (req, res) => {
    const ws = gfs.createWriteStream({
      filename: req.query.name,
      /*eslint camelcase: 0*/
      content_type: req.query.type,
      metadata: req.query.metadata
    })

    ws.on('close', file => res.status(200).json(file))
    ws.on('error', () => res.sendStatus(422))
    req.pipe(ws)
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
   *    HTTP/1.1 412 Precondition Failed
   */
  get('/:id', (req, res) => {
    const query = {_id: mongoose.Types.ObjectId(req.params.id)}
    gfs.files.findOne(query, (err, file) => {
      if (err) return res.sendStatus(412)
      res.contentType(file.contentType)
      gfs.createReadStream(query).pipe(res)
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
   *      "message": "OK"
   *    }
   * @apiErrorExample {json} Error
   *    HTTP/1.1 412 Precondition Failed
   */
  delete('/:id', (req, res) => {
    const query = {_id: mongoose.Types.ObjectId(req.params.id)}
    gfs.remove(query, err => {
      if (err) return res.sendStatus(422)
      return res.status(200).json({message: 'OK'})
    })
  })

module.exports = router
