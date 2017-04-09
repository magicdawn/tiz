'use strict'

const Tiz = require('./lib')
exports = module.exports = Tiz

// re export koa
const Koa = require('koa')
exports.Koa = Koa

// multer util
const multer = require('./lib/multer')
exports.multer = multer