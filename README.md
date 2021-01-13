<p align="center">
  <img src="https://blogimg2020.oss-cn-shenzhen.aliyuncs.com/blogimg/logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.11-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.13.2-brightgreen.svg" alt="element-ui">
  </a>
</p>

## 开发

```bash
# 克隆项目
git clone https://gitee.com/chenpeng991105/vue_shop.git

# 进入项目目录
cd vue_shop

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run serve
```

浏览器访问 http://localhost:8080

## 发布

```bash
# 构建生产环境
npm run build
```

## 部署
**部署之前需要在 vue.config.js 中设置正确的 publicPath**
```js
publicPath: process.env.NODE_ENV === "development" ? "" : "/vue_shop/"
```
```bash
# 创建ge-pages分支
git checkout -b ge-pages

# 添加dist文件夹
git add -f dist

# 提交到本地仓库
git commit -m "deploy"

# 推送到远程仓库
git subtree push --prefix dist origin ge-pages
```


