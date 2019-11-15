module.exports = {
  version: '1.0.0', // 当前config的版本
  // mainPackage: [],
  // subPackages: [],
  dependencies: [ // 为什么用数组？因为想达到只要提供git仓库、需要拉取目录都能把文件拉下来二次开发
    {
      repo: 'https://github.com/guanlinwu/lina-ui.git',
      alias: 'lina', // lina package pull [组件] [git-alias], 这时候，git-alias = lina
      src: 'src/packages', // 仓库的路径
      dest: '<%= dest %>', // 该模块存放的开发目录
      config: 'https://raw.githubusercontent.com/guanlinwu/lina-ui/master/src/config.json', // 组件版本控制文件
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
