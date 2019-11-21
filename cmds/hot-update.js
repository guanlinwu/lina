const ora = require('ora')
const UpdateCheckCores = require('../utils/update-check-cores')

exports.command = 'hot-update'
exports.desc = 'To do hot update cores files'
exports.builder = {}
exports.handler = async function(argv) {
  const spinner = ora({ // loading
    color: 'green',
    indent: 1,
    spinner: 'dots2'
  }).start()
  try {
    let updateCheckCoresObj = new UpdateCheckCores()
    await updateCheckCoresObj.checkUpdateRemote() // 热更新，不经过缓存，直接查询远程版本
    spinner.succeed('hot update success')
  } catch (error) {
    console.log(error)
    spinner.fail('hot update fail')
  }
}
