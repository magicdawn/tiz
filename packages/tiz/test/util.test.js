'use strict'

const LocalUtil = require('../lib/util.js')

describe('LocalUtil', function() {
  it('.basenameNoExt', function() {
    LocalUtil.basenameNoExt(__filename).should.equal('util.test')
  })
})
