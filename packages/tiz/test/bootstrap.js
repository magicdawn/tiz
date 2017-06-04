'use strict'

const { Tiz, DEMO_PATH } = require('./common.js')

before(() => {
  const app = new Tiz(DEMO_PATH)
  return app.start()
})

after(() => {})
