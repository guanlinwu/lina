const shell = require('shelljs')

exports.command = 'pull <name>'
exports.desc = 'Add remote named <name>'
exports.builder = {
}
exports.handler = function (argv) {
  shell.exec('git clone https://github.com/guanlinwu/lina-ui.git')
  console.log(2)
}