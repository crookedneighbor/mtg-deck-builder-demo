'use strict'

const validateSchema = require('../lib/validate-schema')
const db = require('../db')()
const store = Symbol('store')

const REQUIRED_STATIC_PROPERTIES = [
  'schema',
  'collectionName'
]

const REQUIRED_INSTANCE_PROPERTIES = [
  'toJSON'
]

class BaseModel {
  constructor (rawObject) {
    let missingStaticProperty = REQUIRED_STATIC_PROPERTIES.find(prop => !this.constructor[prop])

    if (missingStaticProperty) {
      throw new Error(`Static property ${missingStaticProperty} must be set.`)
    }

    let missingInstanceProperty = REQUIRED_INSTANCE_PROPERTIES.find(prop => !this[prop])

    if (missingInstanceProperty) {
      throw new Error(`${missingInstanceProperty} must be set.`)
    }
    this[store] = {}

    this.applyValuesInSchema(rawObject)

    if (rawObject._id) {
      this._id = rawObject._id
    }
  }

  applyValuesInSchema (rawObject) {
    Object.entries(this.constructor.schema.properties).forEach(([key, value]) => {
      this[store][key] = {
        data: rawObject[key],
        originalData: rawObject[key],
        isChanged: () => {
          return this[store][key].data !== this[store][key].originalData
        }
      }

      Object.defineProperty(this, key, {
        set (value) {
          this[store][key].data = value
        },
        get () {
          return this[store][key].data
        }
      })
    })
  }

  serialize () {

    return serializedData
  }

  isNew () {
    return !this._id
  }

  getChangedData () {
    return Object.entries(this[store]).reduce((data, [key, value]) => {
      if (value.isChanged()) {
        data[key] = value.data
      }

      return data
    }, {})
  }

  validate () {
    let errors = validateSchema.validate(this, this.constructor.schema)

    if (errors.length > 0) {
      const err = new Error(`${this.constructor.name} validation failed.`)

      err.errors = errors

      return err
    }
  }

  save () {
    const err = this.validate()

    if (err) {
      return Promise.reject(err)
    }

    if (this._id) {
      let data = this.getChangedData()

      return db.updateById(this.constructor.collectionName, this._id, data)
    }

    let serializedData = Object.entries(this.constructor.schema.properties).reduce((data, [key, value]) => {
      data[key] = this[key]

      return data
    }, {})

    return db.add(this.constructor.collectionName, serializedData).then((result) => {
      Object.entries(result.ops[0]).forEach(([key, value]) => {
        this[store][key].data = this[store][key].originalData = value
      })
    })
  }

  static findOne (query) {
    return db.findOne(this.collectionName, query).then((result) => {
      return new this(result)
    })
  }

  static find (query) {
    return db.find(this.collectionName, query).then((result) => {
      return result.map(r => new this(r))
    })
  }
}

module.exports = BaseModel
