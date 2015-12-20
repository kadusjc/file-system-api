'use strict'

const express = require('express')
  , router = express.Router()

/**
 * @api {get} / API Status
 * @apiGroup Status
 * @apiSuccess {String} status API status message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "FileSystem API"
 *    }
 */
router.
  get('/', (req, res) => {
    return res.status(200).json({
      status: 'FileSystem API'
    })
  })

module.exports = router
