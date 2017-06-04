'use strict'

const path = require('path')

const DEMO_PATH = path.join(__dirname, '../../tiz-demo')
exports.DEMO_PATH = DEMO_PATH

const Tiz = require('../')
exports.Tiz = Tiz

exports.startOptions = {
  listen: false,
  tiz: {
    globals: {
      models: false,
      services: false,
      tasks: false
    }
  }
}
