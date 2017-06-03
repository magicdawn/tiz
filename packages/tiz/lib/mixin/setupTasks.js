'use strict'

const _ = require('lodash')
const LocalUtil = require('../util.js')

module.exports = function() {
  this.tasks = this.tasks || {}

  const jsFiles = this._getJsFiles('app/tasks')
  for (let f of jsFiles) {
    let name = LocalUtil.basenameNoExt(f)
    name = _.camelCase(name)
    name = _.upperFirst(name)

    const fileRel = `app/tasks/${ f }`
    const fileAbs = this.resolve(fileRel)
    const taskModule = require(fileAbs)
    if (!taskModule || !taskModule.start || !_.isFunction(taskModule.start)) {
      const msg = `expect a \`exports.start\` function in '${ fileRel }'`
      throw new Error(msg)
    }

    this.tasks[name] = taskModule
    taskModule.start()
  }
}