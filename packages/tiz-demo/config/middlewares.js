'use strict'

/**
 * middlewares
 */

module.exports = [
  'favicon',
  'static',
  'logger',
  'bodyparser',
  'routing',
]

/**
 * koa-bodyparser options
 * https://github.com/koajs/bodyparser#options
 */

module.exports.bodyparserOptions = {
  enableTypes: ['json', 'form', 'text'],
}