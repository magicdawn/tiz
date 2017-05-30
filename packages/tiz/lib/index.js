'use strict'

const assert = require('assert')
const pathresolve = require('path').resolve
const fs = require('fs')
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

  async start(startConfig) {
    // global var
    global.tiz = this
    const app = this

    // read configs
    this.config = this.readConfig(startConfig)

    // service
    this.setupServices()

    // plugins
    this.setupPlugins()

    // views
    this.setupViews()

    // middlewares
    this.setupMiddlewares()

    // await bootstrap
    const bsp = this.appHome + '/bootstrap.js'
    if (fs.existsSync(bsp)) {
      await require(bsp).call(this, this)
    }

    // listen
    if (this.config.listen !== false) {
      await new Promise((resolve, reject) => {
        app.listen(this.config.port, function() {
          console.log('tiz listening at http://localhost:%s', this.address().port)
          app.server = this
          app.emit('ready')
          resolve()
        })
      })
    }
  }
}

/**
 * add mixin
 */

Object.assign(Tiz.prototype, mixins)