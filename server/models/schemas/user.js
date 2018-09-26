// https://stackoverflow.com/a/574698
const EMAIL_MAX_LENGTH = 254
const MAX_STRING_LENGTH = 300

module.exports = {
  id: 'UserModel',
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    account: {
      type: 'object',
      properties: {
        displayName: {
          type: 'string',
          maxLength: MAX_STRING_LENGTH,
          required: true
        },
        email: {
          type: 'string',
          maxLength: EMAIL_MAX_LENGTH,
          required: true
        },
        hashedPassword: {
          type: 'string',
          maxLength: MAX_STRING_LENGTH,
          required: true
        }
      },
      required: true
    }
  }
}
