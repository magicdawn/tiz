'use strict'

/**
 * module dependencies
 */

require('log-reject-error')()
const Tiz = require('tiz')

process.chdir(__dirname)
const app = new Tiz(__dirname)
app.initTiz()
module.exports = app

console.log(app.config)
console.log(app.models)