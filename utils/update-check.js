/**
 * 检查包是否需要更新，如果需要则提示
 * @see https://www.npmjs.com/package/update-check
 */
const pkg = require('../package.json')
const checkForUpdate = require('update-check')

let update = null

try {
  update = await checkForUpdate(pkg)
} catch (err) {
  console.error(`Failed to check for updates: ${err}`)
}

if (update) {
  console.log(`The latest version is ${update.latest}. Please update!`)
}
