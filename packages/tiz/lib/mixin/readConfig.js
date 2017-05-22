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
const LocalUtil = require('../util.js')
const argv = require('minimist')(process.argv.slice(2))

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

const handleValue = val => {
  if (val === 'true' || val === 'false') {
    return JSON.parse(val)
  }

  if (/^\d+$/.test(val)) {
    return JSON.parse(val)
  }

  return val
}

module.exports = function(startConfig) {
  let ret = {}

  let files = glob.sync('*.@(js|yml|yaml|json)', {
    cwd: this.configHome
  })

  for (let file of files) {
    const key = _.camelCase(LocalUtil.basenameNoExt(file))
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
  const defaultEnvFile = _.find(envFiles, file => LocalUtil.basenameNoExt(file) === 'default')
  if (defaultEnvFile) {
    const env = load(this.configHome + '/env/' + defaultEnvFile)
    debug('env default: %j', env)
    _.merge(ret, env)
  }

  // koa Application, this.env
  const envFile = _.find(envFiles, file => LocalUtil.basenameNoExt(file) === this.env)
  if (envFile) {
    const env = load(this.configHome + '/env/' + envFile)
    debug('env %s: %j', this.env, env)
    _.merge(ret, env)
  }

  // 命令行参数
  const options = _.omit(argv, ['_'])
  for (let key of Object.keys(options)) {
    let val = options[key]
    options[key] = handleValue(val)
  }
  _.merge(ret, options)

  // process.env
  const envNames = Object.keys(process.env).filter(s => /^tiz_/.test(s))
  for (let key of envNames) {
    const configKey = _.trim(key).slice('tiz_'.length)
    let configVal = process.env[key]
    if (typeof configVal === 'undefined') continue

    configVal = handleValue(configVal)
    _.set(ret, configKey, configVal)
  }

  // port, PORT
  const PORT = process.env.PORT
  if (typeof PORT === 'number' || (typeof PORT === 'string' && /^\d+$/.test(PORT))) {
    ret.port = Number(PORT)
  }

  // startConfig
  if (startConfig) {
    _.merge(ret, startConfig)
  }

  return ret
}