const shell = require('shelljs')
exports.command = 'pull <pkgName>'
exports.desc = 'pull specific packages <pkgName> from remote repository'
exports.builder = {
}
exports.handler = function (argv) {
  // 判断是否有安装git
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    process.exit(1) // 强制退出
  }
  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,3}\.\d{1,3})/g
  let gitVersionResult = shell.exec('git --version').stdout.match(gitVersionReg)
  if (gitVersionResult) {
    lgitVersionResult[0].split('.')
  }
}