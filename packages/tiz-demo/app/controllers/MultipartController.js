'use strict'

const multer = require('tiz-multer')

const upload = multer({
  dest: tiz.projectHome + '/app/public/uploads',
})

module.exports = {
  upload: [
    upload.single('image'),
    async function(ctx) {
      const req = ctx.request
      const res = ctx.response

      console.log({
        file: req.file,
        files: req.files,
        body: req.body,
      })
      ctx.body = 'OK'
    },
  ],

  upload2: async function(ctx) {
    try {
      await ctx.uploadSingle('image', {
        dest: tiz.projectHome + '/app/public/uploads',
      })
    } catch (e) {
      console.error(e.stack || e)
      return (this.body = e)
      // throw e
    }

    console.log(this.request)
    this.body = {
      body: this.request.body,
    }
  },
}
