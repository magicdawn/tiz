'use strict'

const debug = require('debug')('tiz:setupPlugins')

/**
 * 加载插件
 */

module.exports = function() {
  const plugins = this.config.tiz.plugins
  if (!plugins || !plugins.length) {
    debug('no plugins config, skiping')
    return
  }

  for (let p of plugins) {
    if (typeof p === 'string') {
      p = require(p) // load module
    }

    // call `plugin.install(app)`
    p.install(this)
  }
}