// ==UserScript==
// @name         init-config 初始化配置
// @version      0.0.1
// @description  初始化配置，生成lina.conf.js
// ==/UserScript==

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const memFs = require('mem-fs') // 用这个为了后续可以定义多个模版，不直接用文件读写正则替换
const editor = require('mem-fs-editor')

const configFileName = 'lina.config.js' // 配置文件名称

/**
 * 加载模版
 *
 * @param {*} config
 */
const loadTemplate = (config) => {
  const store = memFs.create()
  const tpl = editor.create(store)

  const cwd = process.cwd()
  const projectPath = cwd

  // lina.config.js
  tpl.copyTpl(path.join(__dirname, '..', 'templates', 'lina.config.js'), path.join(projectPath, 'lina.config.js'), {
    dest: config.dest
  })

  /**
   * 输出
   */
  tpl.commit(() => {
    console.log(`${chalk.green('✔ ')}${chalk.green(`创建文件: ${chalk.grey.green('lina.config.js')}`)}`)
  })
}

/**
 * 是否已经存在lina.conf.js
 * @returns {Boolean} 是否已经存在lina.conf.js
 */
const hasInitConfig = () => {
  isExistsSync = fs.existsSync(configFileName)
  if (isExistsSync) {
    console.log(chalk.yellow(`sorry, the file ${configFileName} has been create.`))
  }
  return isExistsSync
}

/**
 * 是否已经初始化了
 *
 * @returns {Boolean} 是否已经初始化了
 */
exports.hasInit = () => {
  return fs.existsSync(configFileName)
}

/**
 * 执行初始化，总逻辑入口
 *
 */
exports.init = async () => {

  if (hasInitConfig()) { // 如果已经存在配置文件
    process.exit(1)
  }

  const responses = await inquirer
  .prompt([
    {
      type: 'input',
      message: 'lina package 存放的目录',
      name: 'dest',
      default: 'src/components/lina_modules' // 默认值
    }
  ])
  /**
   * 加载模版
   */
  loadTemplate({
    ...responses
  })
}
