exports.command = 'pull [pkgName] [--git-alias]'
exports.description = 'pull specific package(s) from remote repository'
exports.builder = function (yargs) {
  return yargs.commandDir('package_cmds')
}
exports.handler = function (argv) {
}