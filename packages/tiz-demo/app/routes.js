'use strict'

module.exports = {
  'get /hello': 'HomeController.hello',
  'get /hello/': 'HomeController.hello',
  '/user/:id/:name?': 'HomeController.userinfo',
}