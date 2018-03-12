# simple-require

由于自己对于前端模块化方面的知识一直没有深入研究,只停留在使用的阶段.所以决定自己写一个简单的require.js来抛砖迎玉学习这方面的知识(仅供学习)

#### 使用说明
引入myRequire.js,并在data-main属性中指定入口文件。myRequire.js加载之后,会请求入口文件。

```html
<script src="../../myRequire.js" data-main="./main.js"></script>
```

```
参数说明:
dep: 为依赖的模块数组
successCallback: dep中的依赖都成功加载之后执行的成功回调
failCallback: 依赖加载失败时执行的失败回调

require(dep,successCallback,errorCallback)
    负责依赖加载并执行相应的回调.如果依赖都成功加载会执行successCallback.successCallback执行时会依次传入dep中所引入的js的导出值(通过define导出)作为参数

define(dep,successCallback,errorCallback)
    define负责加载依赖,并在successCallback中return当前js的导出值
```

#### 查看示例
```js
npm install
npm run start   // 启动服务 打开localhost:3000查看demo
                // 具体处理逻辑查看控制台输出
```