## lina 版本计划

### 1.0
+ 要写readme，用户是能查到要拉的组件表
+ lina package 指令可以批量拉或者单独拉，批量拉（inquire checkbox）
+ lina page 拉取重复的页面
+ lina hot-update-cores 热更新逻辑cores
```bash
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
