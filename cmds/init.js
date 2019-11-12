const initConfig = require('../cores/init-config')

exports.command = 'init'
exports.desc = 'Create an config file in current directory'
exports.builder = {
}
exports.handler = function (argv) {
  initConfig.init()
}