'use strict'

const Koa = require('koa')
const Router = require('impress-router')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const logger = require('koa-logger')
const routing = require('impress-router-table')

module.exports = class Tiz extends Koa {
  constructor() {
    super()
    this._setup()
  }

  _setup() {
    // cache
    this.use(conditional())
    this.use(etag())

    // favicon
    // app.use(favicon(__dirname + '/public/favicon.ico'))

    // router
    this.router = new Router()
    this.use(this.router)

    // static
    this.router.use('/public', serve(__dirname + '/public', {
      maxage: 365 * 86400 * 1000
    }))

    // log
    if (this.env !== 'test') {
      this.use(logger())
    }

    // routing
    const pwd = process.cwd()
    this.use(routing(pwd + '/app'))
  }
}