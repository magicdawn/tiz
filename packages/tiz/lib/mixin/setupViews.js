'use strict'

const debug = require('debug')('tiz:setupViews')
const consolidate = require('consolidate')
const views = require('koa-generic-views')

module.exports = function() {
  const config = this.config.views
  if (!config || config.enable === false) {
    debug('views disabled')
    return
  }

  views(this, {
    viewRoot: this.resolve(config.root),
    defaultExt: config.extension,
  })

  for (let name in config.map) {
    const ext = name
    const engineName = config.map[name]
    this.engine(ext, consolidate[engineName])
  }

  // export consolidate
  this.consolidate = consolidate
}