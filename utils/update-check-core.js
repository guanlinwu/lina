/**
 * 检查包cores文件是否需要更新，对cores文件进行热更新
 * 1 对比版本
 * 2 针对性拉取文件
 * 3 覆盖或者替换
 */
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const coresConfig = require('../cores.json')
const fly = require('flyio')
const chalk = require('chalk')
const shell = require('shelljs')
const ora = require('ora')
const Configstore = require('configstore')
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
    this.ONE_DAY = 1000 * 60 * 60 * 24
    this.config = new Configstore(`update-cores-${pkg.name}`)
  }

  async init () {
    // await this.autoCheck()
    // await this.checkUpdateRemote()
    await this.hotUpdate()
  }

  async autoCheck () {
    let _updateCheckInterval = this.ONE_DAY
    let lastUpdateCheckTime = this.config.get('lastUpdateCheckTime') // 上一次检查更新的时间
    let nowTimeStamp = Date.now() // 当前时间
    if (!lastUpdateCheckTime || nowTimeStamp > lastUpdateCheckTime + _updateCheckInterval) { // 如果可以检查更新
      console.log('need checkUpdateRemote')
      await this.checkUpdateRemote() // 远程检查并根据需要更新cores文件
      this.config.set('lastUpdateCheckTime', nowTimeStamp) // 更新检查时间
    }
  }
  /**
   * 远程检查并根据需要更新cores文件
   *
   * @returns
   * @memberof checkUpdateRemote
   */
  async checkUpdateRemote () {
    try {
      let { data } = await fly.get(`https://raw.githubusercontent.com/guanlinwu/lina/master/package.json?v=${new Date().getTime()}`)
      this.remotePkg = JSON.parse(data)
      if (semver.gt(this.remotePkg.coresVersion, this.pkg.coresVersion)) { // 执行更新
        await this.hotUpdate()
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 执行热更新
   * 远程拉取最新的cores，覆盖旧的cores
   *
   * @memberof UpdateCheckCores
   */
  async hotUpdate () {
    const linaCliPath = path.join(path.resolve(process.execPath, '..', '..'), 'lib', '/node_modules', '@linahome', 'cli')

    for (let updateTarget of coresConfig.updateTargets) {
      await this.pullFiles({
        repository: updateTarget.repository,
        remoteTarget: updateTarget.remoteTarget,
        dest: `${pwd().stdout}${updateTarget.dest}` // FIXME:临时
      })
    }
    // /**
    //  * 更新cmds目录
    //  */
    // await this.pullFiles({
    //   repository: 'https://github.com/guanlinwu/lina.git',
    //   remoteTarget: 'cmds',
    //   dest: `${pwd().stdout}/cmds` // FIXME:临时
    // })
    // /**
    //  * 更新template目录
    //  */
    // await this.pullFiles({
    //   repository: 'https://github.com/guanlinwu/lina.git',
    //   remoteTarget: 'templates',
    //   dest: `${pwd().stdout}/templates` // FIXME:临时
    // })
    // /**
    //  * 更新README.md
    //  */
    // await this.pullFiles({
    //   repository: 'https://github.com/guanlinwu/lina.git',
    //   remoteTarget: 'README.md',
    //   dest: `${pwd().stdout}/` // FIXME:临时
    // })
  }

  /**
   * 远程拉取文件，并且覆盖
   *
   * @param {*} { repository, remoteTarget, dest }
   * repository：远程仓库
   * remoteTarget 要拉取的远程仓库目录/文件
   * dest 输出目录
   * silent 是否显示输出 默认false
   * @memberof UpdateCheckCores
   */
  pullFiles({ repository, remoteTarget, dest, silent }) {
    return new Promise((resolve) => {
      let spinner = null
      let _silent = silent ? true : false
      if (!_silent) {
        spinner = ora({ // loading
          color: 'green',
          indent: 1,
          spinner: 'dots2'
        }).start('please wait patiently\n')
        spinner.text = `now pulling ${remoteTarget}\n`
      }

      const isDirectory = remoteTarget.indexOf('.') <= -1 // 简单判断是否是目录

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
        !_silent && (spinner.text = `\n`)
        cd('../') // 返回上一级
        if (+code !== 0) {
          !_silent && spinner.fail(
            `fail to pull ${remoteTarget}, please check parameter and try again`
          )
        } else {
          mkdir('-p', `${dest}`) // 确保目录存在
          isDirectory ? mv(`tmp/${remoteTarget}/*`, `${dest}/`) : mv(`tmp/${remoteTarget}`, `${dest}/`)
          !_silent && spinner.succeed(chalk.green(`hot update: ${remoteTarget} succeed`))
        }
        rm('-rf', `tmp`) // 移除临时的目录
        resolve()
      })
    })
  }
}

const updateCheckCores = async () => {
  let updateCheckCoresObj = new UpdateCheckCores()
  await updateCheckCoresObj.init()
}

exports.updateCheckCores = updateCheckCores