'use strict'

module.exports = {
  async all(ctx) {
    const arr = await Post.findAll()
    this.body = {
      success: true,
      data: {
        list: arr
      }
    }
  },

  async comments(ctx) {
    ctx.body = await PostComment.findAll()
  },
}