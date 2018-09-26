'use strict'

let db

module.exports = function getLogger () {
  if (!db) {
    const MongoDriver = require('./mongo')

    db = new MongoDriver()
  }

  return db
}
