const BaseModel = require('../../../server/models/base')
const db = require('../../../server/db')()

describe('BaseModel', function () {
  class CustomModel extends BaseModel {
    static get schema () {
      return {
        id: 'CustomModel',
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          foo: {
            type: 'string'
          },
          bar: {
            type: 'boolean',
            required: true
          },
          baz: {
            type: 'object',
            properties: {
              biz: {
                type: 'string'
              },
              buz: {
                type: 'number'
              },
              boz: {
                type: 'boolean'
              }
            },
            additionalProperties: false
          },
          buz: {
            type: 'string',
            enum: ['a', 'b', 'c']
          }
        },
        additionalProperty: false
      }
    }

    static get collectionName () {
      return 'customModels'
    }

    toJSON () {
      return this
    }
  }

  it('throws an error if it is attempted to be instantiated', function () {
    expect(() => {
      new BaseModel({}) // eslint-disable-line no-new
    }).to.throw()
  })

  it('throws an error if no schema is provided', function () {
    class InvalidCustomModel extends BaseModel {
    }

    expect(() => {
      new InvalidCustomModel({}) // eslint-disable-line no-new
    }).to.throw('Static property schema must be set.')

    expect(() => {
      new CustomModel({}) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws an error if extended class does not include a collectionName attribute', function () {
    class InvalidCustomModel extends BaseModel {
      static get schema () {
        return []
      }
    }

    expect(() => {
      new InvalidCustomModel({}) // eslint-disable-line no-new
    }).to.throw('Static property collectionName must be set.')

    expect(() => {
      new CustomModel({}) // eslint-disable-line no-new
    }).to.not.throw()
  })

  it('throws an error if extended class does not include a toJSON function', function () {
    class InvalidCustomModel extends BaseModel {
      static get schema () {
        return []
      }

      static get collectionName () {
        return 'invalidCustomModels'
      }
    }

    expect(() => {
      new InvalidCustomModel({}) // eslint-disable-line no-new
    }).to.throw('toJSON must be set.')

    expect(() => {
      new CustomModel({}) // eslint-disable-line no-new
    }).to.not.throw()
  })

  describe('schema', function () {
    it('applies _id field if it exists', function () {
      let model = new CustomModel({
        _id: 'document-id',
        foo: 'value'
      })

      expect(model._id).to.equal('document-id')
    })

    it('does not apply properties that are not in the schema', function () {
      let model = new CustomModel({
        foo: 'value',
        notInSchema: 'value'
      })

      expect(model.foo).to.equal('value')
      expect(model.notInSchema).to.not.exist
    })

    it('applies all properties in nested properties', function () {
      let model = new CustomModel({
        baz: {
          biz: 'foo',
          buz: 25,
          boz: 'foo'
        }
      })

      expect(model.baz.biz).to.equal('foo')
      expect(model.baz.buz).to.equal(25)
      expect(model.baz.boz).to.equal('foo')
    })
  })

  describe('isNew', function () {
    it('returns true if an _id property does not exist', function () {
      let model = new CustomModel({})

      expect(model.isNew()).to.equal(true)
    })

    it('returns false if an _id property does exist', function () {
      let model = new CustomModel({
        _id: 'unique-id'
      })

      expect(model.isNew()).to.equal(false)
    })
  })

  describe('validate', function () {
    it('returns an error with a list of validation errors for instance', function () {
      let model = new CustomModel({
        _id: 'unique-id',
        bar: true
      })

      let err = model.validate()

      expect(err).to.not.exist

      model.foo = 42 // not correct type

      err = model.validate()

      expect(err.errors).to.have.a.lengthOf(1)
    })
  })

  describe('save', function () {
    beforeEach(function () {
      this.sandbox.stub(db, 'add').resolves({
        _id: 'unique-id',
        bar: true
      })
      this.sandbox.stub(db, 'updateById').resolves({
        _id: 'unique-id',
        bar: false
      })
    })

    it('adds a new entry to database if it is a new data', function () {
      let model = new CustomModel({
        bar: true
      })

      return model.save().then(() => {
        expect(db.add).to.be.calledOnce
        expect(db.add).to.be.calledWith('customModels', model)
        expect(db.updateById).to.not.be.called
      })
    })

    it('updates only changed properties from instantiation if it is an existing document', function () {
      let model = new CustomModel({
        _id: 'unique-id',
        bar: true
      })

      model.bar = false

      return model.save().then(() => {
        expect(db.updateById).to.be.calledOnce
        expect(db.updateById).to.be.calledWith('customModels', model._id, {bar: false})
        expect(db.add).to.not.be.called
      })
    })

    it('errors if validation fails', function () {
      let model = new CustomModel({
        foo: 'bar'
      })

      return model.save().then(expectToReject).catch((err) => {
        expect(err.message).to.equal('CustomModel validation failed.')
        expect(err.errors).to.have.a.lengthOf(1)
        expect(err.errors[0].message).to.equal('bar is required.')
      })
    })
  })

  describe('findOne', function () {
    beforeEach(function () {
      this.sandbox.stub(db, 'findOne').resolves({foo: 'bar'})
    })

    it('queries for one object in db with the specified parameters', function () {
      return CustomModel.findOne({foo: 'bar'}).then((result) => {
        expect(db.findOne).to.be.calledWith('customModels', {foo: 'bar'})
      })
    })

    it('resolves with an instance of the class', function () {
      return CustomModel.findOne({foo: 'bar'}).then((result) => {
        expect(result).to.be.an.instanceof(CustomModel)
      })
    })
  })

  describe('find', function () {
    beforeEach(function () {
      this.sandbox.stub(db, 'find').resolves([{foo: 'bar'}, {foo: 'baz'}])
    })

    it('queries for any number of object in db with the specified parameters', function () {
      return CustomModel.find({foo: 'bar'}).then((result) => {
        expect(result).to.have.lengthOf(2)
        expect(db.find).to.be.calledWith('customModels', {foo: 'bar'})
      })
    })

    it('resolves with an instance of the class', function () {
      return CustomModel.find({foo: 'bar'}).then((result) => {
        expect(result[0]).to.be.an.instanceof(CustomModel)
        expect(result[1]).to.be.an.instanceof(CustomModel)
      })
    })
  })
})
