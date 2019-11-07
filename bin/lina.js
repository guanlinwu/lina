#!/usr/bin/env node

const chalk = require('chalk')
/**
 * 用_｜/\输出英文 lina
 */
const figlet = require('figlet')
console.log(
  chalk.yellow(
    figlet.textSync('lina', { horizontalLayout: 'full' })
  )
)

require('yargs')
  .commandDir('../cmds')
  .demandCommand()
  .help()
  .argv
