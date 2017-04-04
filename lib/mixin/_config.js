'use strict'

/**
 * Tiz config
 */

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const glob = require('glob')
const yaml = require('js-yaml')
const debug = require('debug')('tiz:config')

const load = filepath => {
  const ext = path.extname(filepath).slice(1)
  if (ext === 'js' || ext === 'json') {
    return require(filepath)
  }

  const content = fs.readFileSync(filepath, 'utf8')
  return yaml.safeLoad(content, {
    filename: filepath,
    json: true
  })
}

/**
 * 去除 ext 的 basename
 */

const basenameNoExt = file => path.basename(file, path.extname(file))

module.exports = function() {
  let ret = {}

  let files = glob.sync('*.@(js|yml|yaml|json)', {
    cwd: this.configHome
  })

  for (let file of files) {
    const key = _.camelCase(basenameNoExt(file))
    if (ret[key]) {
      console.warn('Tiz config: duplicate config key = %s', key)
      continue
    }

    const filepath = path.join(this.configHome + '/' + file)
    const cur = load(filepath)

    // merge options
    const local = {}
    local[key] = cur
    _.merge(ret, local)
  }

  /**
   * env config
   */

  const envFiles = glob.sync('*.@(js|yml|yaml|json)', {
    cwd: this.configHome + '/env'
  })

  // default env
  const defaultEnvFile = _.find(envFiles, file => basenameNoExt(file) === 'default')
  if (defaultEnvFile) {
    const env = load(this.configHome + '/env/' + defaultEnvFile)
    debug('env default: %j', env)
    _.merge(ret, env)
  }

  // koa Application, this.env
  const envFile = _.find(envFiles, file => basenameNoExt(file) === this.env)
  if (envFile) {
    const env = load(this.configHome + '/env/' + envFile)
    debug('env %s: %j', this.env, env)
    _.merge(ret, env)
  }

  return ret
}