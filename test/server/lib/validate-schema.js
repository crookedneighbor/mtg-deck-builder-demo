const validate = require('../../../server/lib/validate-schema').validate

describe('validate', function () {
  beforeEach(function () {
    this.schema = {
      id: 'CustomModel',
      type: 'object',
      properties: {
        stringProperty: {
          type: 'string',
          minLength: 3,
          maxLength: 10
        },
        requiredBoolean: {
          type: 'boolean',
          required: true
        },
        nestedProperty: {
          type: 'object',
          properties: {
            nestedPropertyString: {
              type: 'string',
              minLength: 3,
              maxLength: 10
            },
            nestedPropertyNumber: {
              type: 'number',
              required: true
            },
            nestedPropertyBoolean: {
              type: 'boolean'
            },
            nestedPropertyEnum: {
              type: 'number',
              enum: [1, 2, 3]
            },
            evenFurtherNestedProperty: {
              type: 'object',
              properties: {
              },
              additionalProperties: false
            }
          },
          additionalProperties: false
        },
        enumProperty: {
          type: 'string',
          enum: ['a', 'b', 'c']
        }
      },
      additionalProperties: false
    }
  })

  it('returns an empty array if all fields are valid', function () {
    let object = {
      stringProperty: 'value',
      requiredBoolean: true,
      nestedProperty: {
        nestedPropertyString: 'value',
        nestedPropertyNumber: 11,
        nestedPropertyBoolean: false
      },
      enumProperty: 'a'
    }

    let errors = validate(object, this.schema)

    expect(errors).to.have.a.lengthOf(0)
  })

  it('returns an array of errors if required fields are not provided', function () {
    let object = {
      stringProperty: 'bar',
      nestedProperty: {
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(2)
    expect(errors[0].message).to.equal('requiredBoolean is required.')
    expect(errors[1].message).to.equal('nestedProperty.nestedPropertyNumber is required.')
  })

  it('returns an array of errors if string fields are under minumum length', function () {
    let object = {
      stringProperty: 'a',
      requiredBoolean: true,
      nestedProperty: {
        nestedPropertyNumber: 1,
        nestedPropertyString: 'a'
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(2)
    expect(errors[0].message).to.equal('stringProperty does not meet minimum length of 3.')
    expect(errors[1].message).to.equal('nestedProperty.nestedPropertyString does not meet minimum length of 3.')
  })

  it('returns an array of errors if string fields are under minumum length', function () {
    let object = {
      stringProperty: 'abcdefghijklmnop',
      requiredBoolean: true,
      nestedProperty: {
        nestedPropertyNumber: 1,
        nestedPropertyString: 'abcdefghijklmnop'
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(2)
    expect(errors[0].message).to.equal('stringProperty does not meet maximum length of 10.')
    expect(errors[1].message).to.equal('nestedProperty.nestedPropertyString does not meet maximum length of 10.')
  })

  it('returns an array of errors if field is not the right type', function () {
    let object = {
      stringProperty: 99,
      requiredBoolean: true,
      nestedProperty: {
        nestedPropertyNumber: 'foo'
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(2)
    expect(errors[0].message).to.equal('stringProperty is not of a type(s) string.')
    expect(errors[1].message).to.equal('nestedProperty.nestedPropertyNumber is not of a type(s) number.')
  })

  it('returns an array of errors if non-schema field is included', function () {
    let object = {
      requiredBoolean: true,
      notInSchemaOnRoot: 'value',
      nestedProperty: {
        nestedPropertyString: 'value',
        nestedPropertyNumber: 99,
        notInSchema: 'value',
        evenFurtherNestedProperty: {
          stillNotInSchema: 99
        }
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(3)
    expect(errors[0].message).to.equal('nestedProperty.evenFurtherNestedProperty.stillNotInSchema was not found in the schema.')
    expect(errors[1].message).to.equal('nestedProperty.notInSchema was not found in the schema.')
    expect(errors[2].message).to.equal('notInSchemaOnRoot was not found in the schema.')
  })

  it('returns an array of errors if non-enum value is used', function () {
    let object = {
      requiredBoolean: true,
      enumProperty: 'foo',
      nestedProperty: {
        nestedPropertyNumber: 99,
        nestedPropertyEnum: 0
      }
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(2)
    expect(errors[0].message).to.equal('nestedProperty.nestedPropertyEnum is not one of enum values: 1,2,3.')
    expect(errors[1].message).to.equal('enumProperty is not one of enum values: a,b,c.')
  })

  it('returns an error object with multiple errors', function () {
    let object = {
      stringProperty: 99,
      nestedProperty: {
        nestedPropertyString: 'value',
        notInSchema: 'value'
      },
      enumProperty: 'foo'
    }

    let errors = validate(object, this.schema)

    expect(errors.length).to.equal(5)
  })
})
