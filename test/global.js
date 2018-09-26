process.env.MONGO_URL = 'mongodb://mongo:27017/mtg-deck-test'
process.env.MONGO_DATABASE = 'mtg-deck-test'

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')

chai.use(sinonChai)
global.expect = chai.expect
global.expectToReject = function () {
  throw new Error('Expected Promise to reject, but it resolved')
}

before(function () {
  this.sandbox = sinon.createSandbox()
})

afterEach(function () {
  this.sandbox.restore()
})
