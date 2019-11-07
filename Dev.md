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
├── utils/
│
└── CHANGELOG.md
```

+ README.md 使用文档
+ CHANGELOG.md 开发文档，不发布到npm
+ bin/ 导出的命令
+ cmds/ 命令模块
+ utils/ 工具包