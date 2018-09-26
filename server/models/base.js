'use strict'

const validateSchema = require('../lib/validate-schema')
const db = require('../db')()

const REQUIRED_STATIC_PROPERTIES = [
  'schema',
  'collectionName'
]

const REQUIRED_INSTANCE_PROPERTIES = [
  'toJSON'
]

function applyValuesInSchema (schema, self, rawObject) {
  Object.entries(schema.properties).forEach(([key, value]) => {
    if (rawObject[key] != null) {
      self[key] = rawObject[key]
    }
  })
}

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

    applyValuesInSchema(this.constructor.schema, this, rawObject)

    if (rawObject._id) {
      this._id = rawObject._id
    }
  }

  isNew () {
    return !this._id
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
      return db.updateById(this.constructor.collectionName, this._id, this)
    }

    return db.add(this.constructor.collectionName, this)
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
