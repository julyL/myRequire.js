## myRequire.js
> 自己写的一个简单的模块加载工具,主要用于学习模块加载和依赖处理,具体使用可查看[示例demo](https://github.com/julyL/myRequire.js/tree/master/demo)

#### 使用说明

引入`myRequire.js`,将入口文件的地址赋值给`data-main`,入口文件会在`myRequire.js`执行时加载

```html
<script src="myRequire.js" data-main="./main.js"></script>
```

#### 入口文件
```js
// main.js
require(["a"], function (a) {
  console.log(a);
}, function () {
  console.error("fail");
});
```
#### 依赖模块
```js
// a.js
define(['./b'],function (b) {
  return {
    a: 'aaa',
    b: b
  };
});
```
require接受3个参数`require(dep,successCallback,failCallback)`

1. dep必须为数组,里面的值为js路径
2. successCallback为成功回调
3. failCallback为失败回调

define同样接受3个参数`define(dep,successCallback,failCallback)`但需要注意几点:

1. dep为可选传
2. 由于依赖模块的加载是通过依赖模块的路径实现的,一个模块对应一个路径,一个路径对应一个js文件,所以每个js文件只能执行一次`define`方法进行导出(执行多个define会默认采用第一个define)
---
[源码地址](https://github.com/julyL/myRequire.js/blob/master/myRequire.js)




