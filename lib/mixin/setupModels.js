'use strict'

const assert = require('assert')
const Sequelize = require('sequelize')
const _ = require('lodash')
const LocalUtil = require('../util.js')
const debug = require('debug')('tiz:models')
const pathjoin = require('path').join

/**
 * ### models
 *
 * - `models/wa_test.js` become model `WaTest`
 * - `models/connname/test.js` become model `Test` and using connection `connname`
 */

module.exports = function() {
  if(!this.configs.connections) {
    console.warn('Tiz config connections is empty')
  }

  this.sequelizes = {}
  this.models = this.models || {}

  /**
   * building sequelizes
   */

  for(let name in this.configs.connections) {
    const conn = this.configs.connections[name]
    const options = _.assign({}, this.configs.sequelize, conn)
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
      let key = LocalUtil.basenameNoExt(file)
      key = _.camelCase(key)
      const Key = _.capitalize(key)

      if(this.models[Key]) {
        console.warn('Tiz model: duplicate model, key = %s', Key)
        continue
      }

      // save reference
      this.models[Key] = Model
      if(this.configs.tiz.globals.models) {
        global[Key] = Model
      }
    }
  }

  for(let name in this.sequelizes) {
    let dir = 'app/models'

    // none default connection
    if(name !== this.configs.connection) {
      dir += '/' + name
    }

    // build models
    build(dir, name)
  }
}