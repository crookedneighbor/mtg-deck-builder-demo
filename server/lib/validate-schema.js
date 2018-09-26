const Validator = require('jsonschema').Validator
const v = new Validator()

function getProperty (err) {
  return err.property.split('instance.')[1]
}

function getErrorBasicMessage (err) {
  return `${getProperty(err)} ${err.message}.`
}

const VALIDATION_ERROR_MAP = {
  required: getErrorBasicMessage,
  type: getErrorBasicMessage,
  additionalProperties (err) {
    let property = getProperty(err) || ''

    if (property) {
      property += '.'
    }

    property += err.argument

    return `${property} was not found in the schema.`
  },
  enum: getErrorBasicMessage,
  minLength: getErrorBasicMessage,
  maxLength: getErrorBasicMessage
}

function validate (object, schema) {
  let errors = v.validate(object, schema).errors

  return errors.map((err) => {
    if (!(err.name in VALIDATION_ERROR_MAP)) {
      return err
    }

    return new Error(VALIDATION_ERROR_MAP[err.name](err))
  })
}

module.exports = {
  validate
}
