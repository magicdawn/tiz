'use strict'

const dirname = require('path').dirname
const debug = require('debug')('tiz:setupViews')
const consolidate = require('consolidate')
const views = require('koa-generic-views')
const resolveFrom = require('resolve-from')
const importFrom = require('import-from')

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

  const resolveFromProjectHome = resolveFrom.bind(null, this.projectHome)
  const importFromProjectHome = importFrom.bind(null, this.projectHome)
  const consolidateDir = dirname(require.resolve('consolidate'))

  for (let name in config.map) {
    const ext = name
    const engineName = config.map[name]

    const has = resolveFrom.silent(consolidateDir, engineName)
    if (!has) {
      // if `consolidate` can not require('engine')
      // we manualy set `consolidate.requires` = `require from projectHome (engineName)`
      // see node core flag, symlink
      const engineModule = importFromProjectHome(engineName)
      consolidate.requires[engineName] = engineModule
    }

    // add to `koa-generic-views`
    this.engine(ext, consolidate[engineName])
  }

  // export consolidate
  this.consolidate = consolidate
}