'use strict'

const TestService = require('app/services/TestService')

module.exports = {
  hello(ctx) {
    ctx.body = TestService
  },

  userinfo(ctx) {
    ctx.body = ctx.params
  },
}