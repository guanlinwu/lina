const ora = require('ora')
const shell = require('shelljs')
const inquirer = require('inquirer')
const fly = require('flyio')
const fs = require('fs')

const {
  mkdir,
  cd,
  exec,
  pwd,
  rm,
  mv
} = shell
// ora容器
let spinner = null
// 所有包的数据
let packageData = []
// 从选择列表选择的包名
let packageName = ''
// 配置的统一资源定位符（url😄）
let configUrl = ''
class HandlePull {
  constructor({ argv, linaConfig }) {
    this.argv = argv
    this.linaConfig = linaConfig

    if (this.argv.pkgName) { // 如果指令有参数（模块名）
      /*
       * ora 配置
       * see https://www.npmjs.com/package/ora
       *
       * */
      spinner = ora({
        color: 'green',
        indent: 1,
        spinner: 'dots2'
      }).start('please wait patiently\n')

      this.findPkg() // 如果命令行有模块名直接进行拉去操作
    } else {
      spinner = ora({
        color: 'green',
        indent: 1,
        spinner: 'dots5'
      }).start('getting all packages, please wait for a moment...\n')

      this.getPackagesName() // 如果命令行没有模块名，则需要远程拉取所有包名
    }

  }

  async getPackagesName() {
    const depArr = this.linaConfig.dependencies
    let len = depArr.length
    // 输入的参数 [--git-alias = lina] 或者 [--git-alias  lina]
    let { gitAlias, 'git-alias': literalAlias = 'lina' } = this.argv
    let tmpAlias = gitAlias || literalAlias
    while (len --) {
      let item = depArr[len]
      if (item.alias === tmpAlias) {
        configUrl = item.config
        break
      }
    }
    try {
      let { data } = await fly.get(configUrl)
      packageData = JSON.parse(data).packages
      spinner.succeed(`got all packages, enjoy it`)
      let { packages } = await inquirer.prompt([
        {
          type: 'rawlist',
          name: 'packages',
          message: '请选择模块名',
          pageSize: packageData.length,
          choices: packageData.map(item => item.name)
        }
      ])
      console.log('已选模块：', packages)
      packageName = packages

      spinner = ora({
        color: 'green',
        indent: 1,
        spinner: 'dots2'
      }).start('please wait patiently\n')

      this.findPkg()

    } catch (e) {
      console.error('错误✖', e)
      spinner.fail('error')
    }
  }

  /*
   * 从命令行和linaConfig中获取仓库地址（别名）和其它信息
   * */
  findPkg() {
    const depArr = this.linaConfig.dependencies
    let len = depArr.length
    // 输入的参数 [--git-alias = lina] 或者 [--git-alias  lina]
    let { gitAlias, 'git-alias': literalAlias = 'lina' } = this.argv
    let tmpAlias = gitAlias || literalAlias
    while (len --) {
      if (depArr[len].alias === tmpAlias) {
        // 执行拉取文件夹操作
        let item = depArr[len]
        let repository = item.repo
        let pkgSrc = item.src
        let dest = item.dest
        dest = `./${ dest }`
        !fs.existsSync(dest) && mkdir('-p', dest)
        cd(dest)
        this.pullPkg({
          repository,
          pkgSrc
        })
        break
      }
    }
  }

  /*
   * 执行git 拉取操作
   * */

  pullPkg({ repository, pkgSrc }) {
    let self = this
    spinner.text = `now pulling ${ this.argv.pkgName || packageName }\n`
    console.log('current path:', pwd().stdout)
    exec('git init', { silent: true, async: false })
    exec(`git remote add origin ${ repository }`, { silent: true, async: false })
    exec('git config core.sparsecheckout true', { async: false })
    // echo /languages/ >> .git/info/sparse-checkout
    fs.writeFileSync('.git/info/sparse-checkout', `${ pkgSrc }/${ this.argv.pkgName || packageName }`)
    exec(`git pull --depth=1 origin master`, { silent: true }, function (code) {
      if (+ code !== 0) {
        spinner.fail(`fail to pull ${ self.argv.pkgName || packageName }, please check parameter and try again`)
      } else {
        spinner.succeed(`succeed pull ${ self.argv.pkgName || packageName }`)
      }
      rm('-rf', './.git')
      console.log('lina package 存放的目录:', pwd().stdout)
      mv(`./${ pkgSrc }/${ self.argv.pkgName || packageName }`, './')
      rm('-rf', `./${ pkgSrc.split('/')[0] }`)
      // 有可能上面的while没有结束，所以exitCode默认为0
      process.exit(0)
    })
  }
}
exports.HandlePull = HandlePull