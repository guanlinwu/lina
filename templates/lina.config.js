module.exports = {
  version: '1.0.0', // 当前config的版本
  // mainPackage: [],
  // subPackages: [],
  dependencies: [
    {
      // repo: '',
      // src: 'dist',
      //
      dest: '<%= dest %>', // 该模块存放的开发目录
      items: [ // 需要更新的模块
        {
          'version': '1.0.0', // 组件版本
          'name': 'Toast'
        },
        {
          'version': '1.0.0', // 组件版本
          'name': 'Loading'
        }
      ]
    }
  ]
}
