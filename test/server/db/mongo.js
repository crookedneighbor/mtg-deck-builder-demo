const MongoDriver = require('../../../server/db/mongo')
const MongoClient = require('mongodb').MongoClient

describe('mongoDriver', function () {
  beforeEach(function () {
    this.driver = new MongoDriver()
    this.fakeMethods = {
      insertOne: this.sandbox.stub().resolves(),
      insertMany: this.sandbox.stub().resolves(),
      updateMany: this.sandbox.stub().resolves(),
      updateOne: this.sandbox.stub().resolves(),
      find: this.sandbox.stub().returns({
        toArray: this.sandbox.stub().resolves()
      }),
      findOne: this.sandbox.stub().resolves()
    }
    this.fakeDb = {
      collection: this.sandbox.stub().returns(this.fakeMethods)
    }
  })

  describe('connect', function () {
    it('connects to mongo database', function () {
      this.sandbox.stub(MongoClient, 'connect').resolves({
        db: this.sandbox.stub(),
        isConnected: this.sandbox.stub().returns(false)
      })

      return this.driver.connect().then(() => {
        expect(MongoClient.connect).to.be.calledOnce
        expect(MongoClient.connect).to.be.calledWith('mongodb://localhost:27017/mtg-deck-test')
      })
    })

    it('skips connection if db property already exists', function () {
      this.sandbox.stub(MongoClient, 'connect').resolves({
        db: this.sandbox.stub(),
        isConnected: this.sandbox.stub().returns(true)
      })

      this.driver.client = {
        isConnected: this.sandbox.stub().returns(true)
      }
      this.driver.db = {}

      return this.driver.connect().then((result) => {
        expect(MongoClient.connect).to.not.be.called
        expect(result).to.equal(this.driver.db)
      })
    })

    it('sets up the db property', function () {
      let client = {
        db: this.sandbox.stub().returns('foo'),
        isConnected: this.sandbox.stub().returns(false)
      }
      this.sandbox.stub(MongoClient, 'connect').resolves(client)

      expect(this.driver.db).to.not.exist

      return this.driver.connect().then(() => {
        expect(client.db).to.be.calledOnce
        expect(client.db).to.be.calledWith('mtg-deck-test')
        expect(this.driver.db).to.equal('foo')
      })
    })

    it('resolves with self', function () {
      let client = {
        db: this.sandbox.stub(),
        isConnected: this.sandbox.stub().returns(false)
      }
      this.sandbox.stub(MongoClient, 'connect').resolves(client)

      return this.driver.connect().then((self) => {
        expect(self).to.equal(this.driver)
      })
    })
  })

  describe('disconnect', function () {
    it('disconnects from the mongo database', function () {
      let closeStub = this.sandbox.stub().resolves()
      this.sandbox.stub(MongoClient, 'connect').resolves({
        db: this.sandbox.stub(),
        close: closeStub
      })

      return this.driver.connect().then(() => {
        return this.driver.disconnect()
      }).then(() => {
        expect(closeStub).to.be.calledOnce
      })
    })

    it('clears the db property', function () {
      let client = {
        db: this.sandbox.stub().returns('foo'),
        close: this.sandbox.stub().resolves()
      }
      this.sandbox.stub(MongoClient, 'connect').resolves(client)

      expect(this.driver.db).to.not.exist

      return this.driver.connect().then(() => {
        expect(this.driver.db).to.equal('foo')

        return this.driver.disconnect()
      }).then(() => {
        expect(this.driver.db).to.not.exist
      })
    })
  })

  describe('isConnected', function () {
    it('returns false if no client property', function () {
      delete this.driver.client

      expect(this.driver.isConnected()).to.equal(false)
    })

    it('returns false if client is not connected', function () {
      this.driver.client = {
        isConnected: this.sandbox.stub().returns(false)
      }

      expect(this.driver.isConnected()).to.equal(false)
    })

    it('returns true if client is connected', function () {
      this.driver.client = {
        isConnected: this.sandbox.stub().returns(true)
      }

      expect(this.driver.isConnected()).to.equal(true)
    })
  })

  describe('add', function () {
    beforeEach(function () {
      this.driver.db = this.fakeDb
    })

    it('adds a document', function () {
      return this.driver.add('collection', {foo: 'bar'}).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.insertOne).to.be.calledOnce
        expect(this.fakeMethods.insertOne).to.be.calledWith({foo: 'bar'})
      })
    })

    it('adds multiple documents', function () {
      return this.driver.add('collection', [{foo: 'bar'}, {foo: 'baz'}]).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.insertMany).to.be.calledOnce
        expect(this.fakeMethods.insertMany).to.be.calledWith([{foo: 'bar'}, {foo: 'baz'}])
      })
    })
  })

  describe('update', function () {
    beforeEach(function () {
      this.driver.db = this.fakeDb
    })

    it('updates documents', function () {
      return this.driver.update('collection', {foo: 'bar'}, {update: 'value'}).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.updateMany).to.be.calledOnce
        expect(this.fakeMethods.updateMany).to.be.calledWith({foo: 'bar'}, {update: 'value'})
      })
    })
  })

  describe('updateById', function () {
    beforeEach(function () {
      this.driver.db = this.fakeDb
    })

    it('updates 1 document by id', function () {
      return this.driver.updateById('collection', 'id', {update: 'value'}).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.updateOne).to.be.calledOnce
        expect(this.fakeMethods.updateOne).to.be.calledWith({id: 'id'}, {update: 'value'})
      })
    })
  })

  describe('findOne', function () {
    beforeEach(function () {
      this.driver.db = this.fakeDb
    })

    it('finds one document', function () {
      return this.driver.findOne('collection', {foo: 'bar'}).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.findOne).to.be.calledOnce
        expect(this.fakeMethods.findOne).to.be.calledWith({foo: 'bar'})
      })
    })
  })

  describe('find', function () {
    beforeEach(function () {
      this.driver.db = this.fakeDb
    })

    it('finds documents', function () {
      return this.driver.find('collection', {foo: 'bar'}).then(() => {
        expect(this.fakeDb.collection).to.be.calledOnce
        expect(this.fakeDb.collection).to.be.calledWith('collection')
        expect(this.fakeMethods.find).to.be.calledOnce
        expect(this.fakeMethods.find).to.be.calledWith({foo: 'bar'})
      })
    })
  })
})
