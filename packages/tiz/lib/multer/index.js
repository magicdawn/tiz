'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const multer = require('multer')

const methods = ['any', 'array', 'fields', 'none', 'single']

/**
 * file / files / body
 * ctx.req[name] -> ctx.request[name]
 */

async function delegate(ctx) {
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
 * await Tiz.multer.single('image', {
 *  ctx,
 *  dest: 'dir'
 * })
 */

const uploadFactory = name => async function upload(args, options) {
  options = arguments[arguments.length - 1]
  args = [].slice.call(arguments, 0, -1)
  const upload = multer(options)

  const ctx = options.ctx
  assert(ctx, 'ctx can not be empty')
  delegate(ctx)

  return new Promise((resolve, reject) => {
    const expressMiddleware = upload[name].apply(upload, args)
    expressMiddleware(ctx.req, ctx.res, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

for (let name of methods) {
  exports[name] = uploadFactory(name)
}