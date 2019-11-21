/**
 * 检查包cores文件是否需要更新，对cores文件进行热更新
 * 1 对比版本
 * 2 针对性拉取文件
 * 3 覆盖或者替换
 */
const fs = require('fs')
const path = require('path')
const pkg = require('../cores.json')
const fly = require('flyio')
const chalk = require('chalk')
const shell = require('shelljs')
const ora = require('ora')
const Configstore = require('configstore')
const semver = require('semver')
const {
  mkdir,
  cd,
  pwd,
  chmod,
  cp,
  exec,
  test,
  rm,
  mv
} = shell
/**
 * cores文件热更新模块
 *
 * @class UpdateCheckCores
 */
class UpdateCheckCores {
  constructor ({
    pkg
  }) {
    /**
     * 远程package.json配置
     *
     * @type {Object}
     */
    this.remotePkg = {}
    /**
     * 本地package.json配置
     *
     * @type {Object}
     */
    this.pkg = pkg
    /**
     * 一天的时间，默认是检查更新周期
     *
     * @type {Number}
     */
    this.ONE_DAY = 1000 * 60 * 60 * 24
    /**
     * 缓存配置
     *
     * @type {Object}
     */
    this.config = new Configstore(`update-cores-${pkg.name}`)
  }
  /**
   * 检查缓存，如果达到检查周期，则执行远程检查
   *
   * @memberof UpdateCheckCores
   */
  async autoCheck () {
    let _updateCheckInterval = this.ONE_DAY
    let lastUpdateCheckTime = this.config.get('lastUpdateCheckTime') // 上一次检查更新的时间
    let nowTimeStamp = Date.now() // 当前时间
    if (!lastUpdateCheckTime || nowTimeStamp > lastUpdateCheckTime + _updateCheckInterval) { // 如果可以检查更新
      try {
        await this.checkUpdateRemote() // 远程检查并根据需要更新cores文件
        this.config.set('lastUpdateCheckTime', nowTimeStamp) // 更新检查时间
      } catch (error) {
        console.log(error)
      }
    }
  }
  /**
   * 远程检查并根据需要更新cores文件
   * options.silent 是否显示输出 默认false
   * @returns
   * @memberof UpdateCheckCores
   */
  async checkUpdateRemote ({ silent } = { silent: false }) {
    try {
      let { data } = await fly.get(`https://raw.githubusercontent.com/guanlinwu/lina/master/cores.json?v=${new Date().getTime()}`)
      this.remotePkg = JSON.parse(data)
      if (semver.gt(this.remotePkg.coresVersion, this.pkg.coresVersion)) { // 执行更新
        await this.hotUpdate({
          silent
        })
      } else {
        !silent && console.log(chalk.green(`Ths cores is already latest: ${this.remotePkg.coresVersion}`))
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
  async hotUpdate ({ silent } = { silent: false }) {
    const linaCliPath = path.join(path.resolve(process.execPath, '..', '..'), 'lib', '/node_modules', '@linahome', 'cli') // 正式
    console.log(linaCliPath)
    if (test('-d', linaCliPath)) {
    // if (test('-d', `${pwd().stdout}`)) {
      for (let updateTarget of pkg.updateTargets) {
        await this.pullFiles({
          repository: updateTarget.repository,
          remoteTarget: updateTarget.remoteTarget,
          dest: `${linaCliPath}${updateTarget.dest}`,
          // dest: `${pwd().stdout}${updateTarget.dest}`, // FIXME:临时
          silent
        })
      }
      !silent && console.log(chalk.yellow(`the cores is update latest: ${chalk.dim(this.pkg.coresVersion) + chalk.reset(' → ') + chalk.green(this.remotePkg.coresVersion)}`))
    } else {
      !silent && console.log(chalk.yellow(`Update fail for the path ${linaCliPath} is not found.`))
    }
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
  pullFiles({ repository, remoteTarget, dest, silent } = {silent: false}) {
    return new Promise((resolve) => {
      let spinner = null
      if (!silent) {
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
        !silent && (spinner.text = `\n`)
        cd('../') // 返回上一级
        if (+code !== 0) {
          !silent && spinner.fail(
            `fail to pull ${remoteTarget}, please check parameter and try again`
          )
        } else {
          // mkdir('-p', `${dest}`) // 确保目录存在
          // chmod('-R', 755, `${dest}`)
          isDirectory ? cp('-r', `tmp/${remoteTarget}/*`, `${dest}`) : cp('-f', `tmp/${remoteTarget}`, `${dest}`)
          !silent && spinner.succeed(chalk.green(`hot update: ${remoteTarget} succeed`))
        }
        rm('-rf', `tmp`) // 移除临时的目录
        resolve()
      })
    })
  }
}

/**
 * 热更新，不经过缓存，直接查询远程版本
 */
exports.checkUpdateRemote = async ({silent} = {silent: false}) => {
  // console.log('checkUpdateRemote')
  try {
    let updateCheckCoresObj = new UpdateCheckCores({
      pkg
    })
    await updateCheckCoresObj.checkUpdateRemote({
      silent
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * 热更新，经过缓存，再查询远程版本
 */
exports.updateCheckCores = async () => {
  // console.log('updateCheckCores')
  try {
    let updateCheckCoresObj = new UpdateCheckCores({
      pkg
    })
    await updateCheckCoresObj.autoCheck()
  } catch (error) {
    console.log(error)
  }
}
