/**
 * 检查包cores文件是否需要更新，对cores文件进行热更新
 * 1 对比版本
 * 2 针对性拉取文件
 * 3 覆盖或者替换
 */
const pkg = require('../package.json')
const packageJson = require('package-json')
const fly = require('flyio')
const chalk = require('chalk')
const boxen = require('boxen')
const semver = require('semver')

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
      let { data } = await fly.get('https://raw.githubusercontent.com/guanlinwu/lina/master/package.json')
      this.remotePkg = JSON.parse(data)
      console.log(this.remotePkg)
      // if (semver.gt(this.remotePkg.coresVersion, this.pkg.coresVersion) ) {
      //   console.log('need update')
      // }
    } catch (error) {
      console.log(error)
    }
    return isNeedUpdate
  }

  /**
   * 执行热更新
   *
   * @memberof UpdateCheckCores
   */
  updateCores () {

  }
}

const updateCheckCores = async () => {
  let updateCheckCoresObj = new UpdateCheckCores()
  await updateCheckCoresObj.init()
}

exports.updateCheckCores = updateCheckCores