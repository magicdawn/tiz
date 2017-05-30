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
    const options = Object.assign({}, config.options, conn)
    debug('new sequelize: name = %s, args = %s %s %s %j', name, conn.database, conn.user, conn.password, options)
    this.sequelizes[name] = new Sequelize(conn.database, conn.user, conn.password, options)
  }

  /**
   * building models
   */

  const build = (dir, name) => {
    const files = this._getJsFiles(dir)

    for (let file of files) {
      const modelFile = pathjoin(this.projectHome, dir, file)
      const modelDef = require(modelFile)

      // decide which connections to use
      const conn = modelDef.connection || config['default-connection']
      const seq = this.sequelizes[conn]

      const Model = seq.import(modelFile)
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

  let dir = config.root || 'app/models'
  build(dir)
}