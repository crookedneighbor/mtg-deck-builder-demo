const User = require('../../../server/models/user')

describe('User', function () {
  beforeEach(function () {
    this.user = new User({
      _id: 'user-id',
      account: {
        displayName: 'User Name',
        email: 'user@example.com',
        hashedPassword: 'asdf'
      }
    })
  })

  describe('toJSON', function () {
    it('only returns public fields', function () {
      let json = this.user.toJSON()

      expect(json).to.deep.equal({
        account: {
          displayName: 'User Name',
          email: 'user@example.com'
        }
      })
    })

    it('throws a validation error if model does not pass validation', function () {
      delete this.user.account

      expect(() => {
        this.user.toJSON()
      }).to.throw('User validation failed.')
    })
  })
})
