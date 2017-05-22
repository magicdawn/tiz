'use strict'

const install = require('./lib/install.js')

module.exports = {
  install(app) {
    return install.call(app)
  }
}