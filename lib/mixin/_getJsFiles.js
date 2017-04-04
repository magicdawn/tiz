'use strict'

const glob = require('glob')

/**
 * 获取 js
 */

module.exports = function(subdir) {
  return glob.sync('*.js', {
    cwd: this.projectHome + '/' + (subdir || '')
  })
}