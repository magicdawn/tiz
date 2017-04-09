'use strict'

const Koa = require('koa')
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
    // global var
    global.tiz = this

    // read configs
    this.configs = this.readConfig()

    // models & service
    this.setupModels()
    this.setupServices()

    // middlewares
    this.setupMiddlewares()
  }
}

/**
 * add mixin
 */

Object.assign(Tiz.prototype, mixins)