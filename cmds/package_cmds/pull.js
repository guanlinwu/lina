const shell = require('shelljs')
const semver = require('semver')
const fs = require('fs')
exports.command = 'pull <pkgName>'
exports.desc = 'pull specific packages <pkgName> from remote repository'
exports.builder = {}
exports.handler = function (argv) {
  const linaRepository = 'https://github.com/guanlinwu/lina-ui.git'
  const {
    mkdir,
    cd,
    exec,
    pwd
  } = shell
  // 判断是否有安装git
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.echo('\u001b[32m click here to download https://git-scm.com\u001b[0m')
    process.exit(1) // 强制退出
  }
  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
  let gitVersionResult = shell.exec('git --version', {silent: true}).stdout.match(gitVersionReg)
  if (!gitVersionResult) {
    if (!semver.gt(gitVersionResult[0], '1.7.0')) {
      console.log('\u001b[31m your git version is too low,please update\u001b[0m')
      console.log('\u001b[32m click here to download https://git-scm.com\u001b[0m')
      process.exit(1)
    }
  }
  // 执行拉取文件夹操作
  mkdir('-p', './lina-packages')
  cd('./lina-packages')
  pwd()
  exec('git init', {silent: true, async: false})
  exec(`git remote add origin ${linaRepository}`, {silent: true, async: false})
  exec('git config core.sparsecheckout true', {async: false})
  // echo /languages/ >> .git/info/sparse-checkout
  fs.writeFileSync('.git/info/sparse-checkout', `src/packages/${argv.pkgName}`)
  exec(`git pull origin master`, {async: false})
}