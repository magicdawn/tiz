'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const multerPkg = require('multer')
const _ = require('lodash')

// methods need to be patched
const methods = ['any', 'array', 'fields', 'none', 'single']

/**
 * @example
 *
 * ```js
 * const multer = require('tiz-multer')
 * const upload = multer({
 *  dest: '/data/uploads'
 * })
 *
 * router.get(upload.single('image'), async ctx => {
 *  // blabla
 * })
 * ```
 */

exports = module.exports = function multer(...args) {
  const upload = multerPkg(...args)
  const ret = {}

  for (let name of methods) {
    // require('tiz-multer').single(...)
    ret[name] = function(...args) {
      const expressMiddleware = upload[name](...args)
      return async (ctx, next) => {
        await work(ctx, expressMiddleware)
        return next()
      }
    }
  }

  return ret
}

// expose originalMulter
exports.multerPkg = multerPkg
exports.diskStorage = multerPkg.diskStorage
exports.memoryStorage = multerPkg.memoryStorage

/**
 * file / files / body
 * ctx.req[name] -> ctx.request[name]
 */

function delegate(ctx) {
  for (let key of ['file', 'files', 'body']) {
    Object.defineProperty(ctx.req, key, {
      get() {
        return ctx.request[key]
      },
      set(value) {
        ctx.request[key] = value
      },
      configurable: true,
      enumerable: false,
    })
  }
}

/**
 * real work
 */

function work(ctx, expressMiddleware) {
  // do delegate
  delegate(ctx)

  // call expressMiddleware
  return new Promise((resolve, reject) => {
    expressMiddleware(ctx.req, ctx.res, err => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}

/**
 * as a plugin
 *
 * example Usage:
 * await ctx.multer.single(xxx)
 */

exports.install = function(app) {
  app.context.multer = {}
  for (let name of methods) {
    const key = 'upload' + _.upperFirst(name)
    app.context[key] = async function(...args) {
      const options = args[args.length - 1]
      const upload = multerPkg(options)
      const expressMiddleware = upload[name](...args)
      const ctx = this
      return work(ctx, expressMiddleware)
    }
  }
}
