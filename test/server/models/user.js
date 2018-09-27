const User = require('../../../server/models/user')

describe.only('User', function () {
  beforeEach(function () {
    this.user = new User({
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
      this.user.account = null

      expect(() => {
        this.user.toJSON()
      }).to.throw('User validation failed.')
    })
  })

  describe('save', function () {
    it('creates a new user', function () {
      expect(this.user._id).to.not.exist

      return this.user.save().then((res) => {
        return User.findOne({_id: this.user._id})
      }).then((user) => {
        expect(user._id).to.deep.equal(this.user._id)
        expect(user.account).to.deep.equal(this.user.account)
      })
    })
  })
})
