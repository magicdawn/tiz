'use strict'

/**
 * this will extend the koa context
 */

module.exports = {
  // ctx.platform
  get platform() {
    const pl = this.get('pl') || this.query.pl

    if (pl === '01') {
      return 'android'
    }

    if (pl === '02') {
      return 'ios'
    }

    return 'h5'
  },

  // type(val) {
  //   this.response.type = val
  // }
}