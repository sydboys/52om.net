## Build Setup

``` bash
# 安装依赖
npm install

# 本地启动
npm run dev

# 打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 文件结构
页面结构（src）：
`./assets` 包含重置部分element的默认样式、二次封装的axios请求方法

`./router`  路由配置文件

`./components` 页面所在位置

* `./index` 首页

* `./album` 相册页面

* `./edit` 编辑页

* `./common` 公共的头部组件


## 技术栈

* ui库  element-ui

* 主题框架  vue

* 路由  vue-router（history模式）

* 请求  axios

* 更多详情参见package.json文件

* css  scss预处理器

* 重置浏览器默认样式  normalize.css