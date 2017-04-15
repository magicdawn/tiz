'use strict'

module.exports = {
  async njk() {
    this.state.title = 'data via state'
    console.log('-------')
    await this.render('index', {
      body: 'data via locals'
    })
    console.log('done')
    console.log(this.body)
  }
}