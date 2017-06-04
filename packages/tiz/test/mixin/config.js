'use strict'

const _ = require('lodash')
const { Tiz, DEMO_PATH } = require('../common.js')
const startOptions = {
  listen: false,
  tiz: {
    globals: {
      models: false,
      services: false,
      tasks: false
    }
  }
}

describe('Tiz config', function() {
  it('via config file', function() {
    // use default tiz
    tiz.config.port.should.equal(0)
  })

  it('via process.env.tiz_*', async function() {
    process.env['tiz_hello.world.env'] = 'nested'
    const app = new Tiz(DEMO_PATH)
    await app.start(startOptions)
    app.config.hello.world.env.should.equal('nested')

    // clean
    delete process.env['tiz_hello.world.env']
  })

  it('via command line args', async function() {
    process.argv.push('--hello.world.cli')
    process.argv.push('nested')

    const app = new Tiz(DEMO_PATH)
    await app.start(startOptions)
    app.config.hello.world.cli.should.equal('nested')

    // clean
    _.times(2, process.argv.pop.bind(process.argv))
  })

  it('via #start(config)', async function() {
    const app = new Tiz(DEMO_PATH)
    await app.start(
      Object.assign({}, startOptions, {
        hello: {
          world: {
            startOptions: 'nested'
          }
        }
      })
    )

    app.config.hello.world.startOptions.should.equal('nested')
  })
})
