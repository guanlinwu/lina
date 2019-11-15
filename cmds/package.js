exports.command = 'package pull <packageName>'
exports.description = 'Pull package(s) from specified Repository '
exports.builder = function (yargs) {
  return yargs.commandDir('package_cmds')
}
exports.handler = function (argv) {
}