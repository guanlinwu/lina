#!/usr/bin/env node

const chalk = require('chalk')
/**
 * 用_｜/\输出英文 lina
 */
const figlet = require('figlet')
console.log(
  chalk.magenta(figlet.textSync('lina', { horizontalLayout: 'full' }))
)

const argv = require('yargs')
  .commandDir('../cmds', { recurse: true })
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