'use strict'

module.exports = {
  get(ctx) {
    ctx.body = {
      query: ctx.query,
    }
  },

  post(ctx) {
    console.log(ctx.request.body)
    ctx.body = ctx.request.body
  }
}