'use strict'

const MongoClient = require('mongodb').MongoClient

module.exports = class MongoDriver {
  connect () {
    return MongoClient.connect('mongodb://mongo:27017/mtg-deck').then((client) => {
      this.db = client.db('mtg-deck')

      return this
    })
  }

  add (collection, docs) {
    let operation = 'insert'

    if (Array.isArray(docs)) {
      operation += 'Many'
    }

    return this.db.collection(collection)[operation](docs)
  }

  update (collection, filter, updates) {
    return this.db.collection(collection).updateMany(filter, updates)
  }

  updateById (collection, id, updates) {
    return this.db.collection(collection).updateOne({id}, updates)
  }

  findOne (collection, query) {
    return this.db.collection(collection).findOne(query)
  }

  find (collection, query) {
    return this.db.collection(collection).find(query).toArray()
  }
}
