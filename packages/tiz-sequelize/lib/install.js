'use strict'

const assert = require('assert')
const pathjoin = require('path').join
const Sequelize = require('sequelize')
const _ = require('lodash')
const debug = require('debug')('tiz-sequelize:install')

/**
 * ### models
 *
 * - `models/wa_test.js` become model `WaTest`
 * - `models/connname/test.js` become model `Test` and using connection `connname`
 */

module.exports = function() {
  this.sequelizes = {}
  this.models = this.models || {}

  const config = this.config.sequelize
  if (!config || !config.enable) {
    debug('no sequelize config or disabled')
    return
  }

  if (!config.connections) {
    debug('no connections found, skiping')
    console.warn('[tiz-sequelize] connections is empty, skiping load')
    return
  }

  /**
   * building sequelizes
   */

  for (let name in config.connections) {
    const conn = config.connections[name]
    const options = Object.assign({}, this.config.sequelize, conn)
    debug('new sequelize: name = %s, args = %s %s %s %j', name, conn.database, conn.user, conn.password, options)
    this.sequelizes[name] = new Sequelize(conn.database, conn.user, conn.password, options)
  }

  /**
   * building models
   */

  const build = (dir, name) => {
    const seq = this.sequelizes[name]
    const files = this._getJsFiles(dir)
    for (let file of files) {
      const Model = seq.import(pathjoin(this.projectHome, dir, file))
      let key = this._util.basenameNoExt(file)
      key = _.camelCase(key)
      const Key = _.upperFirst(key)

      if (this.models[Key]) {
        console.warn('Tiz model: duplicate model, key = %s', Key)
        continue
      }

      // save reference
      this.models[Key] = Model
      if (this.config.tiz.globals.models) {
        global[Key] = Model
      }
    }
  }

  for (let name in this.sequelizes) {
    let dir = config.root || 'app/models'

    // none default connection
    if (name !== config['default-connection']) {
      dir += '/' + name
    }

    // build models
    build(dir, name)
  }
}