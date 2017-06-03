'use strict'

const multer = require('koa-multer')
const Tiz = require('tiz')

async function delegate(ctx, next) {
  // file / files / body
  // ctx.req[name] -> ctx.request[name]
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
  return next()
}

const upload = multer({
  dest: tiz.projectHome + '/app/public/uploads'
})

module.exports = {
  upload2: async function(ctx) {
    try {
      await Tiz.multer.single('image', {
        ctx,
        dest: tiz.projectHome + '/app/public/uploads'
      })
    } catch (e) {
      console.error(e.stack || e)
      return this.body = e
      // throw e
    }

    console.log(this.request)
    this.body = {
      body: this.request.body,
    }
  },

  upload: [
    delegate,
    upload.single('image'),
    async function(ctx) {
      const req = ctx.request
      const res = ctx.response

      await ctx.multer.single('', {
        ctx,
        dest: tiz.projectHome + '/app/public/uploads',
      })

      console.log({
        file: req.file,
        files: req.files,
        body: req.body,
      })
      ctx.body = 'OK'
    }
  ]
}