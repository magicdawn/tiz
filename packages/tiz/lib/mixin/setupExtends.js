'use strict'

const _ = require('lodash')
const LocalUtil = require('../util.js')
const importFrom = require('import-from')

/**
 * load `app/extends`
 */

module.exports = function() {
  const files = this._getJsFiles('app/extends')
  const importFromExtends = importFrom.bind(null, this.resolve('app/extends'))

  /**
   * Application
   */

  if (files.includes('application.js')) {
    const cur = importFromExtends('./application.js')

    // console.log(cur);
    // console.log(Object.keys(cur));
    // for (let key in cur) {
    //   console.log(key);
    // }

    extend(this, cur)
  }
  if (files.includes('application.' + this.env + '.js')) {
    const cur = importFromExtends('./application.' + this.env + '.js')
    extend(this, cur)
  }

  /**
   * Context
   */

  if (files.includes('context.js')) {
    const cur = importFromExtends('./context.js')
    extend(this.context, cur)
  }
  if (files.includes('context.' + this.env + '.js')) {
    const cur = importFromExtends('./context.' + this.env + '.js')
    extend(this.context, cur)
  }

  /**
   * Request
   */

  if (files.includes('request.js')) {
    const cur = importFromExtends('./request.js')
    extend(this.request, cur)
  }
  if (files.includes('request.' + this.env + '.js')) {
    const cur = importFromExtends('./request.' + this.env + '.js')
    extend(this.request, cur)
  }

  /**
   * Response
   */

  if (files.includes('response.js')) {
    const cur = importFromExtends('./response.js')
    extend(this.response, cur)
  }
  if (files.includes('response.' + this.env + '.js')) {
    const cur = importFromExtends('./response.' + this.env + '.js')
    extend(this.response, cur)
  }
}

/**
 * extend but support `get` / `set` descriptor
 *
 * http://rinat.io/blog/mixing-in-and-extending-javascript-getters-and-setters
 */

function extend(object, ...sources) {
  for (let source of sources) {
    for (let key in source) {
      if (!source) continue
      const descriptor = Object.getOwnPropertyDescriptor(source, key)
      if (descriptor) {
        Object.defineProperty(object, key, descriptor)
      } else {
        object[key] = source[key]
      }
    }
  }
}