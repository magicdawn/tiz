'use strict'

const debug = require('debug')('tiz:setupPlugins')
const importForm = require('import-from')

/**
 * 加载插件
 */

module.exports = function() {
  const plugins = this.config.tiz.plugins
  if (!plugins || !plugins.length) {
    debug('no plugins config, skiping')
    return
  }

  const importPlugin = importForm.bind(null, this.projectHome)

  for (let p of plugins) {
    if (typeof p === 'string') {
      p = importPlugin(p) // load module
    }

    // call `plugin.install(app)`
    p.install(this)
  }
}
