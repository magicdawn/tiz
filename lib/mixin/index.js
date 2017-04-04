'use strict'

const glob = require('glob')
const _ = require('lodash')
const LocalUtil = require('../util.js')

const files = glob.sync('*.js', {
  cwd: __dirname
})
_.pull(files, 'index.js')

// load
for (let file of files) {
  const key = LocalUtil.basenameNoExt(file)
  exports[key] = require('./' + key)
}