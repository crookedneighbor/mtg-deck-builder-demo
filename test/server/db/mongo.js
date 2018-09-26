const MongoDriver = require('../../../server/db/mongo')
const MongoClient = require('mongodb').MongoClient

describe('mongoDriver', function () {
  beforeEach(function () {
    this.driver = new MongoDriver()
    this.fakeMethods = {
      insert: this.sandbox.stub().resolves(),
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
        db: this.sandbox.stub()
      })

      return this.driver.connect().then(() => {
        expect(MongoClient.connect).to.be.calledOnce
        expect(MongoClient.connect).to.be.calledWith('mongodb://mongo:27017/mtg-deck')
      })
    })

    it('sets up the db property', function () {
      let client = {
        db: this.sandbox.stub().returns('foo')
      }
      this.sandbox.stub(MongoClient, 'connect').resolves(client)

      expect(this.driver.db).to.not.exist

      return this.driver.connect().then(() => {
        expect(client.db).to.be.calledOnce
        expect(client.db).to.be.calledWith('mtg-deck')
        expect(this.driver.db).to.equal('foo')
      })
    })

    it('resolves with self', function () {
      let client = {
        db: this.sandbox.stub()
      }
      this.sandbox.stub(MongoClient, 'connect').resolves(client)

      return this.driver.connect().then((self) => {
        expect(self).to.equal(this.driver)
      })
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
        expect(this.fakeMethods.insert).to.be.calledOnce
        expect(this.fakeMethods.insert).to.be.calledWith({foo: 'bar'})
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
