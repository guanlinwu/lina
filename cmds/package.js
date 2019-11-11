exports.command = 'package <command>'
exports.description = 'Manage package'
exports.builder = function (yargs) {
  return yargs.commandDir('package_cmds')
}
exports.handler = function (argv) {
  console.log('package argv')
  console.log(argv)
}