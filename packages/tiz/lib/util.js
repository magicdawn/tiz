'use strict'

const fs = require('fs')
const path = require('path')

/**
 * 去除 ext 的 basename
 */

exports.basenameNoExt = file => path.basename(file, path.extname(file))
