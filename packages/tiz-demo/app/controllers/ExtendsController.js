'use strict'

module.exports = {
  // extend `application`
  app() {
    console.log(tiz.name)
    this.body = tiz.name
  },

  // extend `ctx`
  ctx() {
    this.body = this.platform + 'asasa'
    this.type = 'html'
  },

  // extend request
  request() {
    // `method` + `getter`
    this.body = {
      getQuery: this.request.getQuery(),
      token: this.request.token,
    }
  },

  // extend response
  response() {
    this.response.send('name')
  },
}