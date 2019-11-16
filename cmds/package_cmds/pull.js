const shell = require('shelljs')
const semver = require('semver')
const chalk = require('chalk')
const initConfig = require('../../cores/init-config.js') // 初始化逻辑
const configFileName = 'lina.config.js' // 配置文件名称
const HandlePull = require('../../utils/handlePull')

exports.command = 'pull [pkgName]'
exports.desc = 'pull specific packages <pkgName> from remote repository'
exports.builder = {
  pkgName: {
    default: ''
  }
}
exports.handler = function (argv) {
  const {
    mkdir,
    cd,
    exec,
    pwd,
    rm,
    mv,
    which
  } = shell

  // 如果不存在配置文件, 则提示需要执行lina init
  if (!initConfig.hasInit()) {
    shell.echo(chalk.red(`Sorry, this config file ${ chalk.yellow(configFileName) } is not found.`))
    shell.echo(chalk.red(`Please try run ${ chalk.yellow('lina init') } command first`))
    process.exit(1) // 强制退出
  }

  // 判断是否有安装git
  if (!which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.echo('\u001b[32m click here to download https://git-scm.com\u001b[0m')
    process.exit(1) // 强制退出
  }

  // 获取配置文件
  const linaConfig = require(`${ pwd().stdout }/${ configFileName }`)
  // props of class
  const options = {
    argv,
    linaConfig
  }

  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
  let gitVersionResult = exec('git --version', { silent: true }).stdout.match(gitVersionReg)
  if (gitVersionResult) {
    if (!semver.gt(gitVersionResult[0], '1.7.0')) {
      console.log('\u001b[31m your git version is too low,please update\u001b[0m')
      console.log('\u001b[32m click here to download https://git-scm.com\u001b[0m')
      process.exit(1)
    }
  }

  new HandlePull.HandlePull(options)
}