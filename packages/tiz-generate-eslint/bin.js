#!/usr/bin/env node

'use strict'

/**
 * generate `.eslintrc.tiz.json`
 */

const Tiz = require('tiz')
const fs = require('fs-extra')

const app = new Tiz(process.cwd())
app.initTiz()

const ret = {
  globals: {}
}

// models
if (app.configs.tiz.globals.models) {
  for (let name in app.models) {
    ret.globals[name] = true
  }
}

// services
if (app.configs.tiz.globals.services) {
  for (let name in app.services) {
    ret.globals[name] = true
  }
}

const filename = '.eslintrc.tiz.json'

fs.outputJsonSync(filename, ret)
console.log(`File: ${ filename } generated !`)