'use strict'

/**
 * global Service
 */

const pathjoin = require('path').join
const _ = require('lodash')
const LocalUtil = require('../util.js')

module.exports = function() {
  if (!this.configs.tiz.globals.services) return

  const files = this._getJsFiles('app/services')
  for (let file of files) {
    const base = LocalUtil.basenameNoExt(file)
    const key = _.camelCase(base)
    const Key = _.upperFirst(key)
    const Service = require(pathjoin(this.projectHome, 'app/services', file))

    if (global[Key]) {
      console.warn('Tiz services ignore: existing global.%s', Key)
      continue
    }

    global[Key] = Service
  }
}