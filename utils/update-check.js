/**
 * 检查包是否需要更新，如果需要则提示
 * @see https://www.npmjs.com/package/update-check
 */
const pkg = require('../package.json')
const chalk = require('chalk')
const boxen = require('boxen')
const checkForUpdate = require('update-check')

const updateCheck = async () => {
	let update = null

  try {
    update = await checkForUpdate(pkg)
  } catch (err) {
    console.error(`Failed to check for updates: ${err}`)
  }

  if (update) {
    let installCommand = `npm i -g @linahome/cli`
    let message = 'Update available ' + chalk.dim(pkg.version) + chalk.reset(' → ') + chalk.green(update.latest) + ' \nRun ' + chalk.cyan(installCommand) + ' to update'
    let boxenOpts = {
			padding: 1,
			margin: 1,
			align: 'center',
			borderColor: 'yellow',
			borderStyle: 'double'
    }
    const result = boxen(message, boxenOpts)

    console.log(result)
  }
}

exports.updateCheck = updateCheck