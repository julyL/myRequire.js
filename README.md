## myRequire.js
> 一个简单的模块加载工具,自己随便先写玩的,跟require.js没任何关系

#### 使用说明

```html
// data-main为入口文件
<script src="myRequire.js" data-main="./main.js"></script>
```

##### require方法
```js
 require(dep,successCallback,failCallback);
//  dep必须为数组,里面的值可以试相对路径
//  successCallback为成功回调
//  failCallback为失败回调
```

##### define方法
```js
 define(dep,successCallback,failCallback);
//  dep可选传,每个js文件相当于一个模块只能执行一个define方法
```
**注:require和define的路径是相对于当前页面**

[源码地址](https://github.com/julyL/myRequire.js/myRequire.js)

[查看示例](https://github.com/julyL/myRequire.js/tree/master/demo)


