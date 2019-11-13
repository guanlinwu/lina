const shell = require('shelljs')
const semver = require('semver')
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')

const initConfig = require('../../cores/init-config.js') // 初始化逻辑
const configFileName = 'lina.config.js' // 配置文件名称

exports.command = 'pull <pkgName>'
exports.desc = 'pull specific packages <pkgName> from remote repository'
exports.builder = {}
exports.handler = function (argv) {
  const {
    mkdir,
    cd,
    exec,
    pwd,
    rm,
    mv
  } = shell
  // 如果不存在配置文件, 则提示需要执行lina init
  if (!initConfig.hasInit()) {
    shell.echo(chalk.red(`Sorry, this config file ${chalk.yellow(configFileName)} is not found.`))
    shell.echo(chalk.red(`Please try run ${chalk.yellow('lina init')} command first`))
    process.exit(1) // 强制退出
  }
  // 获取配置文件
  const linaConfig = require(`${pwd().stdout}/${configFileName}`)

  // 判断是否有安装git
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.echo('\u001b[32m click here to download https://git-scm.com\u001b[0m')
    process.exit(1) // 强制退出
  }

  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
  let gitVersionResult = shell.exec('git --version', {silent: true}).stdout.match(gitVersionReg)
  if (gitVersionResult) {
    if (!semver.gt(gitVersionResult[0], '1.7.0')) {
      console.log('\u001b[31m your git version is too low,please update\u001b[0m')
      console.log('\u001b[32m click here to download https://git-scm.com\u001b[0m')
      process.exit(1)
    }
  }
  /*
  * ora 配置,see https://www.npmjs.com/package/ora
  * */
  const spinner = ora({
    color: 'green',
    indent: 1,
    spinner: 'dots2'
  }).start('please wait patiently\n')
  const depArr = linaConfig.dependencies
  let len = depArr.length
  console.log(argv)
  // 输入的参数 [--git-alias = lina] 或者 [--git-alias  lina]
  let { gitAlias } = argv
  let { 'git-alias': literalAlias = 'lina' } = argv
  while (len--) {
    if (depArr[len].alias === (gitAlias || literalAlias)){
      // 执行拉取文件夹操作
      // 下面这里用解构会导致获取不了值，具体原因初步断定是asyncIterator搞鬼
      let repository = depArr[len].repo
      let pkgSrc = depArr[len].src
      let dest = depArr[len].dest
      dest = `./${dest}`
      !fs.existsSync(dest) && mkdir('-p', dest)
      cd(dest)
      pullPkg({
        repository,
        pkgSrc
      })
    }
  }

  /*
  * 执行git 拉取操作
  * */

  function pullPkg({
                     repository,
                     pkgSrc
                   }) {
    spinner.text = `now pulling ${argv.pkgName}\n`
    console.log('current path:', pwd().stdout)
    exec('git init', { silent: true, async: false })
    exec(`git remote add origin ${repository}`, { silent: true, async: false })
    exec('git config core.sparsecheckout true', { async: false })
    // echo /languages/ >> .git/info/sparse-checkout
    fs.writeFileSync('.git/info/sparse-checkout', `${pkgSrc}/${argv.pkgName}`)
    exec(`git pull --depth=1 origin master`, function (code) {
      if(+code !== 0){
        spinner.fail(`fail to pull ${argv.pkgName}, please check parameter and try again`)
      } else {
        spinner.succeed(`succeed pull ${argv.pkgName}`)
      }
      rm('-rf', './.git')
      console.log(pwd().stdout)
      mv(`./${pkgSrc}/${argv.pkgName}`, './')
      rm('-rf', './src')
      // 有可能上面的while没有结束，所以code默认为0
      process.exit(0)
    })
  }

  /*
  * 删除目录以及其内的文件（夹）
  * */
  function delDirectory (dir) {

    // 此处不用判断不存在路径，前面已经做判断
    const dirInfo = fs.statSync(dir)
    if (dirInfo.isDirectory()) { // 目录
      const dirData = fs.readdirSync(dir) // 目录数据
      if(dirData.length > 0) {
        for ( let i = 0; i< dirData.length; i++){ // 好像for 比 forEach会好点, 不过应该没差别
          delDirectory(`${dir}/${dirData[i]}`) // 这里递归调用，因为它是目录
          dirData.length-1 === i && delDirectory(dir) // 删除完该目录里面的内容之后，需要把这个目录删了
        }
      }else {
        fs.rmdirSync(dir) // 空目录
      }
    } else if(dirInfo.isFile()){
      fs.unlinkSync(dir) // 删除文件
    }
  }
}