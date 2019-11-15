# lina

## 安装
```bash
$ npm i -g @linahome/cli
```

## 相关指令
```bash
# 初始化配置, 在当前文件夹创建一个lina.config.js, 用以作为lina的配置
$ lina init

# 初始化配置, 在当前文件夹创建一个lina.config.js, 用以作为lina的配置
$ lina hot-update

# 通过别名获取包 针对lina组件, 拉取后不要再重新拉, 位置在二次开发目录
$ lina package add [alias] [name]

# 通过别名获取包 针对lina组件, 拉取后可以再重新拉达到更新效果, 位置在不可二次开发目录
$ lina package add [alias] [name]

# 更新（在不可二次开发目录）指定的某个组件
$ lina package update [name]

# 更新（在不可二次开发目录）指定的所有组件
$ lina package update package

# 新配置文件, 在不影响原来修改情况下追加
$ lina package update config
```