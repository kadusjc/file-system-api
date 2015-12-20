'use strict'

module.exports = {
  test: 'mongodb://localhost/fs_test',
  development: 'mongodb://localhost/fs',
  production: process.env.MONGOHQ_URL
}
