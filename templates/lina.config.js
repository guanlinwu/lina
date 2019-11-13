module.exports = {
  version: '1.0.0', // 当前config的版本
  // mainPackage: [],
  // subPackages: [],
  dependencies: [
    {
      repo: 'https://github.com/guanlinwu/lina-ui.git',
      alias: 'lina', // lina package pull [组件] [git-alias], 这时候，git-alias = lina
      src: 'src/packages', // 仓库的路径
      dest: '<%= dest %>', // 该模块存放的开发目录
      items: [ // 需要更新的模块
        // {
        //   'version': '1.0.0', // 组件版本
        //   'name': 'Toast'
        // },
        // {
        //   'version': '1.0.0', // 组件版本
        //   'name': 'Loading'
        // }
      ]
    }
  ]
}
