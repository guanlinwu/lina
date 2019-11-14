// ==UserScript==
// @name         git操作
// @version      0.0.1
// @description  git操作
// ==/UserScript==

const shell = require('shelljs')
const ora = require('ora')
const semver = require('semver')

class Git {
  /**
   * 是否有安装git
   *
   * @memberof Git
   */
  dealInstallGit() {
    if (!shell.which('git')) {
      shell.echo('Sorry, this script requires git')
      shell.echo(
        '\u001b[32m click here to download https://git-scm.com\u001b[0m'
      )
      process.exit(1) // 强制退出
    }
  }

  /**
   * 是否有安装git
   *
   * @memberof Git
   */
  dealValidGit() {
    const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
    let gitVersionResult = shell
      .exec('git --version', { silent: true })
      .stdout.match(gitVersionReg)
    if (gitVersionResult) {
      if (!semver.gt(gitVersionResult[0], '1.7.0')) {
        console.log(
          '\u001b[31m your git version is too low,please update\u001b[0m'
        )
        console.log(
          '\u001b[32m click here to download https://git-scm.com\u001b[0m'
        )
        process.exit(1)
      }
    }
  }
}
