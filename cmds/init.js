exports.command = 'init'
exports.desc = 'Create an config file in current directory'
exports.builder = {
  dir: {
    default: '.'
  }
}
exports.handler = function (argv) {
  console.log('init called for dir', argv.dir)
}