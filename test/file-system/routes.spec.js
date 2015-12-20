'use strict'

const supertest = require('supertest')
  , chai = require('chai')
  , fs = require('fs')
  , GridFS = require('../../lib/gridfs')
  , app = require('../../')
  , request = supertest(app.listen())
  , gfs = GridFS()
  , expect = chai.expect

describe('FileSystem:RoutesSpec', () => {

  let s, fileId

  before(() => {
    s = fs.createReadStream(`${__dirname}/deploying_node.pdf`)
  })

  beforeEach(done => {
    const ws = gfs.createWriteStream()
    ws.on('close', file => {
      fileId = file._id
      done()
    })
    ws.on('error', err => done(err))
    s.pipe(ws)
  })

  describe('POST /v1/file', () => {

    const queryStr = {
      name: 'foo',
      type: 'application/pdf',
      metadata: {
        userId: 'bar'
      }
    }

    it('should create file', done => {
      request.
        post('/v1/file').
        type('multipart/form-data').
        query(queryStr).
        send(new Buffer(s.toString(), 'base64')).
        expect(200, (err, res) => {
          if (err) return done(err)
          expect(res.body._id).to.be.ok
          done()
        })
    })
  })

  describe('GET /v1/file/:id', () => {
    it('should show a file', done => {
      request.
        get(`/v1/file/${fileId}`).
        expect(200, done)
    })
  })

  describe('DELETE /v1/file/:id', () => {
    it('should delete a file', done => {
      request.
        del(`/v1/file/${fileId}`).
        expect(200, done)
    })
  })

})
