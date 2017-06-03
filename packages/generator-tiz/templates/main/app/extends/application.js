'use strict'

/**
 * this will extends the `Application`
 */

module.exports = {
  // get `package.json` name
  // via `app.name` aka `tiz.name`
  get name() {
    const pkg = this.resolve('package.json')
    return require(pkg).name
  }
}