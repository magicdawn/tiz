'use strict'

/**
 * module dependencies
 */

require('log-reject-error')()
const Tiz = require('tiz')

process.chdir(__dirname)
const app = module.exports = new Tiz(__dirname)

app.locals = {
  dataGlobal: 'hello world'
}

app.start().then(() => {
  console.log(app.config)
})