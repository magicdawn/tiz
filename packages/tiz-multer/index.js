'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const multer = require('multer')

// expose originalMulter
exports.originalMulter = multer
exports.diskStorage = multer.diskStorage
exports.memoryStorage = multer.memoryStorage

// methods need to be patched
const methods = ['any', 'array', 'fields', 'none', 'single']

for (let name of methods) {
  // require('tiz-multer').single(...)
  exports[name] = function(...args) {
    const expressMiddleware = multer[name](...args)
    return async (ctx, next) => {
      await work(ctx, expressMiddleware)
      return next()
    }
  }
}

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
    app.context.multer[name] = async function(...args) {
      const expressMiddleware = multer[name](...args)
      const ctx = this
      return work(ctx, expressMiddleware)
    }
  }
}
