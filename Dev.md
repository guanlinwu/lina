# 开发步骤

## 安装指令
```bash
# 安装包
$ yarn install ｜ npm install
# 修改
$ chmod 755 bin/lina.js
# 这样的好处是，可以直接输入lina执行，而不需要再输入路径（bin/lina.js）执行了
$ npm link
# 以下是link成功的输出
/Users/wuguanlin/.nvm/versions/node/v10.16.3/bin/lina -> /Users/wuguanlin/.nvm/versions/node/v10.16.3/lib/node_modules/lina/bin/lina.js
/Users/wuguanlin/.nvm/versions/node/v10.16.3/lib/node_modules/lina -> /Volumes/MacWD/Total/趣米总部/cli/lina

```

## 目录结构
```bash
project/
├── package.json
│
├── README.md
│
├── bin/
│
├── cmds/
│
├── cores/
│
├── templates/
│
├── utils/
│
└── CHANGELOG.md
```

+ README.md 使用文档
+ CHANGELOG.md 开发文档，不发布到npm
+ bin/ 导出的命令
+ cmds/ 命令模块
+ cores/ 核心业务代码 可自动更新
+ templates/ 文件模版 可自动更新
+ utils/ 工具包

## 设想
命令行程序拆分成两部分，cli 和 core，类似于操作系统的 shell 和 kernel。
cli 仅仅是命令的入口，会调用 core 来完成真正的功能。好处：
+ 更容易扩展。比如我们哪天想开发 GUI 程序，那 core 部分的代码是可以直接重用的。
+ cli 变得很轻量，core 可以独立进行更新（甚至可以做后台的静默更新）。
+ 更容易测试。因为 core 是可编程的，我们将更容易针对它编写单元测试。

## 备忘
cores/init-config.js 有一个hasInit的方法，用来判断是否已经初始化配置文件

## cores 热更新
对于cores目录下的文件，都必须遵守以下格式，才能进行热更新
+ 文件头格式
```javascript
// ==UserScript==
// @name         git操作
// @version      0.0.1
// @description  git操作
// ==/UserScript==
```