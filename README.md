# lina
配合[lina-ui](https://www.npmjs.com/package/lina-ui)，可以把指定的ui组件拉取下来，进行二次开发。

## 安装
```bash
$ npm i -g @linahome/cli
```

# 更新日志
[CHANGELOG](https://github.com/guanlinwu/lina/blob/master/CHANGELOG.md)

# issues
[issues](https://github.com/guanlinwu/lina/issues)

## 相关指令
```bash
# 初始化配置, 在当前文件夹创建一个lina.config.js, 用以作为lina的配置
$ lina init

# 热更新核心代码
$ lina hot-update


$ lina package pull <packageName>
# 拉取指定的模块，如果不指定packageName，默认会弹出全部列表进行选择
# 可选的模块有
 - lazyLoadImg
 - Tabs
 - DatetimePicker
 - Picker
 - PullRefresh
 - CarouselNotice
 - PreLoad
 - PopCurtain
 - Popup
 - ActionSheet
 - Dialog
 - Loading
 - Toast
```