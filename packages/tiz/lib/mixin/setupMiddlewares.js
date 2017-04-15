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
const bodyparser = require('koa-bodyparser')
const views = require('koa-views')
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
    list = list.filter(Boolean)
    if (!list.length) return

    const router = new Router()
    this.use(router)

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

      router.use(item.prefix, serve(root, options))
    }
  },

  logger() {
    if (this.env !== 'test') {
      this.use(logger())
    }
  },

  bodyparser() {
    const options = this.configs.middlewares.bodyparserOptions
    this.use(bodyparser(options))
  },

  views() {
    const options = this.configs.views
    const root = pathjoin(this.projectHome, options.root)

    const opts = {
      map: options.map,
      extension: options.extension,
    }
    this.use(views(root, opts))
  },

  routing() {
    this.use(routing(this.appHome))
  }
}

module.exports = function() {
  // cache
  this.use(conditional())
  this.use(etag())

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
    this.use(item)
  }
}