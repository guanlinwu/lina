const updateCheckCores = require('../utils/update-check-cores')

exports.command = 'hot-update'
exports.desc = 'To do hot update cores files'
exports.builder = {
}
exports.handler = function (argv) {
  updateCheckCores.checkUpdateRemote()
}