'use strict'

/**
 * middlewares
 */

const Router = require('impress-router')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const logger = require('koa-logger')
const routing = require('impress-router-table')
const ms = require('ms')
const pathjoin = require('path').join

const builtin = {
  favicon() {
    if (this.configs.static.favicon) {
      this.use(favicon(pathjoin(this.projectHome, this.config.static.favicon)))
    }
  },

  static() {
    let list = this.configs.static.public
    if (!Array.isArray(list)) {
      list = [list]
    }

    for (let item of list) {
      const prefix = item.prefix
      const root = pathjoin(this.projectHome, item.dir)
      const options = item.options || {}

      // maxage
      if (item.maxage) {
        options.maxage = ms(item.maxage)
      }

      // headers
      if (item.headers) {
        options.setHeaders = (res) => {
          for (let key in item.headers) {
            const val = item.headers[key]
            res.setHeader(key, val)
          }
        }
      }

      this.router.use(item.prefix, serve(root, options))
    }
  },

  logger() {
    if (this.env !== 'test') {
      this.use(logger())
    }
  },

  routing() {
    routing(this.appHome, this.router)
  }
}

module.exports = function() {
  // cache
  this.use(conditional())
  this.use(etag())

  // router
  this.router = new Router()
  this.use(this.router)

  // custom middlewares
  for (let item of this.configs.middlewares) {
    // built in
    if (typeof item === 'string') {
      if (!builtin[item]) {
        console.warn('Tiz middleware: no built in middleware %s found', item)
        continue
      }
      item = builtin[item]
      item.call(this)
      continue
    }

    // standard middleware
    this.router.use(item)
  }
}