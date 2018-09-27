'use strict'

const MongoClient = require('mongodb').MongoClient
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/mtg-deck'
const mongoDatabase = process.env.MONGO_DATABASE || 'mtg-deck'

module.exports = class MongoDriver {
  connect () {
    if (this.isConnected()) {
      return Promise.resolve(this.db)
    }

    return MongoClient.connect(mongoUrl).then((client) => {
      this.client = client
      this.db = client.db(mongoDatabase)

      return this
    })
  }

  isConnected () {
    return Boolean(this.client && this.client.isConnected())
  }

  disconnect () {
    return this.client.close().then(() => {
      delete this.client
      delete this.db
    })
  }

  add (collection, docs) {
    let operation = 'insert'

    if (Array.isArray(docs)) {
      operation += 'Many'
    } else {
      operation += 'One'
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
