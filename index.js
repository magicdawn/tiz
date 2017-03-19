'use strict'

const Tiz = require('./lib/index.js')
const Koa = require('koa')

module.exports = Tiz

// reexport koa
Tiz.Koa = Koa