'use strict'

const fs = require('fs')
const basename = require('path').basename
const pathjoin = require('path').join
const Base = require('yeoman-generator')
const _ = require('lodash')
const glob = require('glob')

/**
 * My Generator
 */

module.exports = class TizAppGenerator extends Base {
  constructor(args, opts) {
    super(args, opts)
    this.sourceRoot(pathjoin(__dirname, '../templates/main'))
  }

  /**
   * we starts here
   */

  default () {
    const ok = this._checkPackageJson()
    if (!ok) return

    this._copyFiles()

    this._modifyPackageJson()
  }

  /**
   * 检查 `package.json` 文件
   */

  _checkPackageJson() {
    const destPackageJsonPath = this.destinationPath('package.json')
    const exists = fs.existsSync(destPackageJsonPath)

    // warn
    if (!exists) {
      console.error('\npackage.json not found, run \`npm init\` first')
      return false
    }

    // ok
    return true
  }

  /**
   * 修改 package.json
   *
   * 	- deps
   * 	- scripts.{ test, test-cover }
   */

  _modifyPackageJson() {
    const destPath = this.destinationPath('package.json')
    let dest = this.fs.readJSON(destPath)
    let src = {
      dependencies: {
        tiz: '*',
        'log-reject-error': '*',
        nunjucks: '*',
      },
      scripts: {
        test: 'mocha',
      },
      devDependencies: {
        mocha: '*',
        supertest: '*',
        should: '*',
      },
    }
    src = _.pick(src, 'dependencies', 'devDependencies', 'scripts')

    // defaults
    dest = _.defaultsDeep(dest, src)

    // write
    this.fs.writeJSON(destPath, dest)
  }

  /**
   * 复制文件
   */

  _copyFiles() {
    const files = glob.sync('**/*.*', {
      cwd: pathjoin(__dirname, '../templates/main'),
      dot: true,
    })

    for (let item of files) {
      this.fs.copy(this.templatePath(item), this.destinationPath(item))
    }
  }
}