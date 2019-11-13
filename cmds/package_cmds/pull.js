const shell = require('shelljs')
const semver = require('semver')
const fs = require('fs')
const ora = require('ora')
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
  const spinner = ora({
    color: 'green',
    indent: 1,
    spinner: 'dots2'
  }).start('please wait patiently\n')
  // 判断是否有安装git
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.echo('\u001b[32m click here to download https://git-scm.com\u001b[0m')
    spinner.stop()
    process.exit(1) // 强制退出
  }
  // 判断git版本号,必须大于1.7.0
  const gitVersionReg = /(\d\.\d{1,4}\.\d{1,4})/g
  let gitVersionResult = shell.exec('git --version', {silent: true}).stdout.match(gitVersionReg)
  if (gitVersionResult) {
    if (!semver.gt(gitVersionResult[0], '1.7.0')) {
      console.log('\u001b[31m your git version is too low,please update\u001b[0m')
      console.log('\u001b[32m click here to download https://git-scm.com\u001b[0m')
      spinner.stop()
      process.exit(1)
    }
  }
  // 执行拉取文件夹操作
  // 检查
  !fs.existsSync('./lina-packages') && mkdir('-p', './lina-packages')
  cd('./lina-packages')
  if (!fs.existsSync('.git')) {
    pullPkg()
  } else {
    delDirectory('.git')
    pullPkg()
  }
  /*
  * 执行git 拉取操作
  * */

  function  pullPkg() {
    spinner.text = `now pulling ${argv.pkgName}\n`
    shell.echo('current path:', pwd())
    exec('git init', { silent: true, async: false })
    exec(`git remote add origin ${linaRepository}`, { silent: true, async: false })
    exec('git config core.sparsecheckout true', { async: false })
    // echo /languages/ >> .git/info/sparse-checkout
    fs.writeFileSync('.git/info/sparse-checkout', `src/packages/${argv.pkgName}`)
    exec(`git pull origin master`, function (code) {
      if(+code !== 0){
        spinner.fail(`fail to pull ${argv.pkgName}, please check parameter and try again`)
        process.exit(0)
      } else {
        spinner.succeed(`succeed pull ${argv.pkgName}`)
        process.exit(0)
      }
    })
  }

  /*
  * 删除目录
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