const BaseModel = require('./base')
const schema = require('./schemas/user')

class User extends BaseModel {
  static get schema () {
    return schema
  }

  static get collectionName () {
    return 'User'
  }

  toJSON () {
    let err = this.validate()

    if (err) {
      throw err
    }

    return {
      account: {
        displayName: this.account.displayName,
        email: this.account.email
      }
    }
  }
}

module.exports = User
