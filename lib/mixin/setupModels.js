'use strict'

const assert = require('assert')
const Sequelize = require('sequelize')
const _ = require('lodash')
const LocalUtil = require('../util.js')
const debug = require('debug')('tiz:models')

module.exports = function() {
  // DB
  const conn = this.configs.connections[this.configs.connection]
  const files = this._getJsFiles('app/models')
  this.models = this.models || {}

  if (files.length) {
    assert(conn, 'connection config can not be founded')
  }

  const options = _.assign({}, this.configs.sequelize, {
    host: conn.host,
    port: conn.port,
    dialect: conn.dialect
  })
  debug('sequelize: args = %s, %s, %s, %j', conn.database, conn.user, conn.password, options)
  this.sequelize = new Sequelize(conn.database, conn.user, conn.password, options)

  for (let file of files) {
    const Model = this.sequelize.import(this.appHome + '/models/' + file)
    let key = LocalUtil.basenameNoExt(file)
    key = _.camelCase(key)
    this.models[key] = Model

    // globals
    if (this.configs.tiz.globals.models) {
      const Key = _.capitalize(key)
      global[Key] = Model
    }
  }
}