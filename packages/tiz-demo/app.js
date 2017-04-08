'use strict'

/**
 * module dependencies
 */

require('log-reject-error')()
const Tiz = require('tiz')

const app = new Tiz(__dirname)
app.initTiz()
console.log(app.configs)
console.log(app.models)

module.exports = app