'use strict'

const assert = require('assert')
const pathresolve = require('path').resolve
const Koa = require('koa')
const mixins = require('./mixin')
const LocalUtil = require('./util.js')

const Tiz = module.exports = class Tiz extends Koa {
  constructor(projectHome) {
    super()

    this.projectHome = projectHome || process.cwd()
    this.appHome = this.projectHome + '/app'
    this.configHome = this.projectHome + '/config'

    // others
    this._util = LocalUtil
  }

  /**
   * path.resolve bind for projectHome
   */

  resolve(path) {
    return pathresolve(this.projectHome, path)
  }

  /**
   * init for Tiz
   */

  initTiz() {
    // global var
    global.tiz = this

    // read configs
    this.config = this.readConfig()

    // service
    this.setupServices()

    // middlewares
    this.setupMiddlewares()

    // plugins
    this.setupPlugins()
  }
}

/**
 * add mixin
 */

Object.assign(Tiz.prototype, mixins)