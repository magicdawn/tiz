'use strict'

process.chdir(__dirname)

const app = require('./app')

// port
const port = process.env.PORT || 5000
app.listen(port, function() {
  console.log('tiz listening at http://localhost:%s', this.address().port)
})