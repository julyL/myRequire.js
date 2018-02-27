var define, require;
(function() {
  var main = document.currentScript.getAttribute("data-main"), // document.currentScript为当前正在执行的js(也就是myRequire.js)
    _Modules = {};

  define = _define;
  require = _require;

  // 加载入口文件
  loadJs(main);

  /**
   * 返回一个Promise,当relativePath对应的js加载自身所有依赖之后,Promise对象变为resolved
   * @param {String} relativePath 单个js路径
   */
  function loadDep(relativePath) {
    var src = getAbsolutePath(relativePath);
    if (_Modules[src]) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      _Modules[src] = {
        uid: src,
        status: "pending",
        resolve: resolve
      };
      loadJs(src);
    });
  }

  /**
   * 返回一个Promise对象,当数组中的所有依赖都加载完之后,该Promise对象变为resolved
   * @param {Array} arr js路径组成的数组
   */
  function loadDepArrray(arr) {
    return arr.reduce((pre, current) => {
      return pre.then(() => {
        return loadDep(current);
      });
    }, Promise.resolve());
  }

  /**
   * dep声明的依赖(js)都加载之后,将依赖的返回值(define中的回调函数return的值)按顺序传入成功回调中执行
   * @param {Array} dep 依赖的js
   * @param {Function} successCb 成功回调
   * @param {Function} failCb 失败回调
   */
  function _require(dep, successCb, failCb) {
    var result = [];
    if (Array.isArray(dep)) {
      loadDepArrray(dep).then(
        v => {
          dep.forEach(fielname => {
            result.push(_Modules[getAbsolutePath(fielname)].result);
          });
          successCb.apply(null, result);
        },
        err => {
          failCb(err);
        }
      );
    }
  }

  /**
   * 加载依赖,并声明当前js的导出值(供require使用)
   * @param {Array} dep 依赖的js
   * @param {Function} successCb 成功回调
   * @param {Function} failCb 失败回调
   */
  function _define(dep, successCb, failCb) {
    var src = document.currentScript.src,
      result = [];
    if (_Modules[src] && _Modules[src].status == "pending") {
      if (Array.isArray(dep)) {
        loadDepArrray(dep).then(
          v => {
            dep.forEach(fielname => {
              result.push(_Modules[getAbsolutePath(fielname)].result);
            });
            _Modules[src].resolve();
            assign(_Modules[src], {
              status: "resolved",
              dep: dep,
              result: successCb.apply(null, result)
            });
          },
          err => {
            failCb(err);
          }
        );
      } else if (isFunction(dep)) {
        _Modules[src].resolve();
        assign(_Modules[src], {
          status: "resolved",
          dep: [],
          result: dep()
        });
      }
    }
  }

  /**
   * 返回引用的js的绝对路径
   * @param {String} filepath
   */
  function getAbsolutePath(filepath) {
    var div = document.createElement("div"),
      href;
    div.innerHTML = "<a href=./></a>";
    href = div.firstChild.href; // 获取当前页面绝对路径
    if (!/^.+\.js/.test(filepath)) {
      // 'a' => 'a.js'
      filepath = filepath + ".js";
    }
    filepath = filepath.replace(/^(\.)?\//, ""); // './a.js' , '/a.js'  =>  'a.js'

    var m = filepath.match(/\.\.\//g); //   处理  '../../a.js'
    if (m == null) {
      return href + filepath;
    } else {
      var s = href.split("/");
      s = s.slice(0, -(m.length + 1));
      return s.join("/") + "/" + filepath.replace("../", "");
    }
  }

  function isFunction(fn) {
    return typeof fn == "function";
  }

  function assign(target, obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
  }

  function loadJs(src) {
    var script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    console.log("load ", src);
  }
})();
