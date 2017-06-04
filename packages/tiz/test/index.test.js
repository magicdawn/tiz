'use strict'

const { Tiz, DEMO_PATH, startOptions } = require('./common.js')

describe('Tiz', function() {
  let app
  beforeEach(() => {
    app = new Tiz(DEMO_PATH)
    return app.start(startOptions)
  })

  it('#resolve works', function() {
    const pkg = app.resolve('package.json')
    require(pkg).name.should.equal('tiz-demo')
  })
})
