#!/usr/bin/env node

const chalk = require('chalk')
// const figlet = require('figlet')

;(async () => {
  try {
    await require('../utils/update-check').updateCheck() // 检查更新
    await require('../utils/update-check-cores').updateCheckCores() // 检查更新
  } catch (error) {
    console.log(error)
  }
  /**
   * 用_｜/\输出英文 lina
   */
  // console.log(
  //   chalk.magenta(figlet.textSync('lina', { horizontalLayout: 'full' }))
  // )

  const argv = require('yargs')
    .commandDir('../cmds', { recurse: false })
    .alias('h', 'help')
    .alias('v', 'version')
    .help()
    .epilog(chalk.yellow('for more information visit https://github.com/guanlinwu/lina')) // final message to display when successful.
    .fail((msg, err, yargs) => {
      if (err) throw err
      console.error(msg)
      console.error('you can do this: \n', yargs.help())
      process.exit(1)
    }).argv

  // console.log('from bin/lina.js: ', argv)
})()

