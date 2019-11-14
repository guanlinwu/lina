const shell = require('shelljs')
const semver = require('semver')
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const initConfig = require('../../cores/init-config.js') // 初始化逻辑
const configFileName = 'lina.config.js' // 配置文件名称
const fly = require('flyio')
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
    mv
  } = shell
  // ora容器
  let spinner = null
  // 所有包的数据
  let packageData = []
  // 要安装的包名
  let packageName = ''
  let configUrl = 'https://raw.githubusercontent.com/guanlinwu/lina-ui/master/src/config.json'
  // 如果不存在配置文件, 则提示需要执行lina init
  if (!initConfig.hasInit()) {
    shell.echo(chalk.red(`Sorry, this config file ${ chalk.yellow(configFileName) } is not found.`))
    shell.echo(chalk.red(`Please try run ${ chalk.yellow('lina init') } command first`))
    process.exit(1) // 强制退出
  }
  // 获取配置文件
  const linaConfig = require(`${ pwd().stdout }/${ configFileName }`)

  // 判断是否有安装git
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.echo('\u001b[32m click here to download https://git-scm.com\u001b[0m')
    process.exit(1) // 强制退出
  }

  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
  let gitVersionResult = shell.exec('git --version', { silent: true }).stdout.match(gitVersionReg)
  if (gitVersionResult) {
    if (!semver.gt(gitVersionResult[0], '1.7.0')) {
      console.log('\u001b[31m your git version is too low,please update\u001b[0m')
      console.log('\u001b[32m click here to download https://git-scm.com\u001b[0m')
      process.exit(1)
    }
  }

  if (argv.pkgName) { // 如果指令有参数（模块名）

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

    findPkg() // 如果命令行有模块名直接进行拉去操作
  } else {
    inputPackage() // 如果命令行没有模块名，则需要远程拉取所有包名
  }

  async function inputPackage() {
    try {
      await getPackageData(configUrl)
      let { package } = await inquirer.prompt([
        {
          type: 'rawlist',
          name: 'package',
          message: '请选择模块名',
          choices: packageData.map(item => item.name)
        }
      ])
      console.log('已选模块：', package)
      packageName = package

      spinner = ora({
        color: 'green',
        indent: 1,
        spinner: 'dots2'
      }).start('please wait patiently\n')

      findPkg()

    } catch (e) {
      console.error(1111, e)
    }
  }

  /*
   * 获取所有的包的数据
   *
   * */

  async function getPackageData(url) {
    let { data } = await fly.get(url)
    packageData = JSON.parse(data).packages
  }

  /*
   * 从命令行和linaConfig中获取仓库地址（别名）和其它信息
   * */
  function findPkg() {
    const depArr = linaConfig.dependencies
    let len = depArr.length
    // 输入的参数 [--git-alias = lina] 或者 [--git-alias  lina]
    let { gitAlias, 'git-alias': literalAlias = 'lina' } = argv
    let tmpAlias = gitAlias || literalAlias
    while (len --) {
      if (depArr[len].alias === tmpAlias) {
        // 执行拉取文件夹操作
        let repository = depArr[len].repo
        let pkgSrc = depArr[len].src
        let dest = depArr[len].dest
        dest = `./${ dest }`
        !fs.existsSync(dest) && mkdir('-p', dest)
        cd(dest)
        pullPkg({
          repository,
          pkgSrc
        })
      }
    }
  }

  /*
   * 执行git 拉取操作
   * */

  function pullPkg({
                     repository,
                     pkgSrc
                   }) {
    spinner.text = `now pulling ${ argv.pkgName || packageName }\n`
    console.log('current path:', pwd().stdout)
    exec('git init', { silent: true, async: false })
    exec(`git remote add origin ${ repository }`, { silent: true, async: false })
    exec('git config core.sparsecheckout true', { async: false })
    // echo /languages/ >> .git/info/sparse-checkout
    fs.writeFileSync('.git/info/sparse-checkout', `${ pkgSrc }/${ argv.pkgName || packageName }`)
    exec(`git pull --depth=1 origin master`, function (code) {
      if (+ code !== 0) {
        spinner.fail(`fail to pull ${ argv.pkgName || packageName }, please check parameter and try again`)
      } else {
        spinner.succeed(`succeed pull ${ argv.pkgName || packageName }`)
      }
      rm('-rf', './.git')
      console.log('lina package 存放的目录:', pwd().stdout)
      mv(`./${ pkgSrc }/${ argv.pkgName || packageName }`, './')
      rm('-rf', `./${ pkgSrc.split('/')[0] }`)
      // 有可能上面的while没有结束，所以exitCode默认为0
      process.exit(0)
    })
  }

  /*
   * 删除目录以及其内的文件（夹）
   * */
  function delDirectory(dir) {

    // 此处不用判断不存在路径，前面已经做判断
    const dirInfo = fs.statSync(dir)
    if (dirInfo.isDirectory()) { // 目录
      const dirData = fs.readdirSync(dir) // 目录数据
      if (dirData.length > 0) {
        for (let i = 0; i < dirData.length; i ++) { // 好像for 比 forEach会好点, 不过应该没差别
          delDirectory(`${ dir }/${ dirData[i] }`) // 这里递归调用，因为它是目录
          dirData.length - 1 === i && delDirectory(dir) // 删除完该目录里面的内容之后，需要把这个目录删了
        }
      } else {
        fs.rmdirSync(dir) // 空目录
      }
    } else if (dirInfo.isFile()) {
      fs.unlinkSync(dir) // 删除文件
    }
  }
}