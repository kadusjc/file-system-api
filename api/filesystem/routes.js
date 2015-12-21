'use strict'

const krouter = require('koa-router')
  , mongoose = require('mongoose')
  , router = krouter()
  , gfs = require('../../lib/gridfs')

const options = (fileId, query) => {
  return {
    _id: fileId,
    filename: query.name,
    mode: 'w',
    content_type: query.type,
    metadata: {
      uploadedBy: query.user,
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
  post('/', function *() {
    let fileId = new mongoose.Types.ObjectId()
    let writestream = gfs.createWriteStream(options(fileId, this.request.query))

    writestream.on('close', () => {
      this.status = 200,
      this.body = {id: fileId.toString()}
    })

    writestream.on('error', (err) => this.status = 422)
    this.request.pipe(writestream)
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
  get('/', function *() {

    let fileId = mongoose.Types.ObjectId(this.request.query.id)
    gfs.files.findOne({ _id: fileId}, (err, file) => {
      this.type = file.contentType
      gfs.createReadStream({_id: fileId})
        .pipe(this)
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
  delete('/:id', function *() {
    let options = {_id: mongoose.Types.ObjectId(this.request.query.id)}
    gfs.remove(options, (err) => {
      if (err) return this.status = 422
      this.status = 200;
      this.body = { message: `File ${req.params.id} deleted successfully` }
    })

  })

module.exports = router