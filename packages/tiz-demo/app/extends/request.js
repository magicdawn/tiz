'use strict'

module.exports = {
  get token() {
    if (this.headers.token) {
      return this.headers.token
    }

    return 'token not found'
  },

  getQuery() {
    return this.query
  },
}