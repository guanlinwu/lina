/**
 * 检查包cores文件是否需要更新，对cores文件进行热更新
 * 1 对比版本
 * 2 针对性拉取文件
 * 3 覆盖或者替换
 */
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const fly = require('flyio')
const chalk = require('chalk')
const shell = require('shelljs')
const ora = require('ora')
const semver = require('semver')
const {
  mkdir,
  cd,
  exec,
  pwd,
  rm,
  mv
} = shell
/**
 * cores文件热更新模块
 *
 * @class UpdateCheckCores
 */
class UpdateCheckCores {
  constructor () {
    this.remotePkg = {}
    this.pkg = pkg
  }

  async init () {
    await this.isNeedUpdate()
  }
  /**
   * 是否需要更新cores文件
   *
   * @returns
   * @memberof UpdateCheckCores
   */
  async isNeedUpdate () {
    let isNeedUpdate = false
    try {
      let { data } = await fly.get(`https://raw.githubusercontent.com/guanlinwu/lina/master/package.json?v=${new Date().getTime()}`)
      this.remotePkg = JSON.parse(data)
      if (semver.gt(this.remotePkg.coresVersion, this.pkg.coresVersion) ) { // 执行更新
        console.log('need update')
        this.updateCores()
      }
    } catch (error) {
      console.log(error)
    }
    return isNeedUpdate
  }

  /**
   * 执行热更新
   * 远程拉取最新的cores，覆盖旧的cores
   *
   * @memberof UpdateCheckCores
   */
  updateCores () {
    const linaCliPath = path.join(path.resolve(process.execPath, '..', '..'), 'lib', '/node_modules', '@linahome', 'cli')
    this.pullFiles({
      repository: 'https://github.com/guanlinwu/lina.git',
      remoteTarget: 'cores',
      dest: `${pwd().stdout}/cores` // FIXME:临时
    })
    // this.pullFiles({
    //   repository: 'https://github.com/guanlinwu/lina.git',
    //   remoteTarget: 'cores/git.js',
    //   dest: `${pwd().stdout}/cores` // FIXME:临时
    // })
  }



  /**
   * 远程拉取文件，并且覆盖
   *
   * @param {*} { repository, remoteTarget, dest }
   * repository：远程仓库
   * remoteTarget 要拉取的远程仓库目录
   * dest 输出目录
   * @memberof UpdateCheckCores
   */
  pullFiles({ repository, remoteTarget, dest }) {
    // console.log(remoteTarget)
    const spinner = ora({ // loading
      color: 'green',
      indent: 1,
      spinner: 'dots2'
    }).start('please wait patiently\n')
    spinner.text = `now pulling ${remoteTarget}\n`

    mkdir('-p', 'tmp') // 创建一个tmp目录
    cd('tmp') // 进入tmp目录
    /**
     * 拉取对应目录
     */
    exec('git init', { silent: true, async: false })
    exec(`git remote add origin ${repository}`, { silent: true, async: false })
    exec('git config core.sparsecheckout true', { async: false })
    fs.writeFileSync('.git/info/sparse-checkout', `${remoteTarget}`)
    exec(`git pull --depth=1 origin master`, { silent: true }, function(code) {
      spinner.text = ``
      cd('../') // 返回上一级
      if (+code !== 0) {
        spinner.fail(
          `fail to pull ${remoteTarget}, please check parameter and try again`
        )
      } else {
        mkdir('-p', `${dest}`) // 确保目录存在
        mv(`tmp/${remoteTarget}/*`, `${dest}/`)
        spinner.succeed(chalk.green(`hot update: ${remoteTarget} succeed`))
      }
      rm('-rf', `tmp`) // 移除临时的目录
    })
  }
}

const updateCheckCores = async () => {
  let updateCheckCoresObj = new UpdateCheckCores()
  await updateCheckCoresObj.init()
}

exports.updateCheckCores = updateCheckCores