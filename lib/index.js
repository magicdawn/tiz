'use strict'

const Koa = require('koa')
const Router = require('impress-router')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const logger = require('koa-logger')
const routing = require('impress-router-table')
const mixins = require('./mixin')
const LocalUtil = require('./util.js')
const assert = require('assert')

const Tiz = module.exports = class Tiz extends Koa {
  constructor(projectHome) {
    super()

    this.projectHome = projectHome || process.cwd()
    this.appHome = this.projectHome + '/app'
    this.configHome = this.projectHome + '/config'
  }

  /**
   * init for Tiz
   */

  initTiz() {
    // read configs
    this.configs = this.readConfig()

    // models & service
    this.setupModels()
    this.setupServices()

    this.setupMiddleware()
  }

  setupMiddleware() {
    // cache
    this.use(conditional())
    this.use(etag())

    // favicon
    // app.use(favicon(__dirname + '/public/favicon.ico'))

    // router
    this.router = new Router()
    this.use(this.router)

    // static
    this.router.use('/public', serve(this.appHome + '/public', {
      maxage: 365 * 86400 * 1000
    }))

    // log
    if (this.env !== 'test') {
      this.use(logger())
    }

    // routing
    routing(this.appHome, this.router)
  }

  setupServices() {
    if (!this.configs.tiz.globals.services) {
      return
    }

    // TODO: add service globals
  }
}

/**
 * add mixin
 */

for (let name in mixins) {
  Tiz.prototype[name] = mixins[name]
}