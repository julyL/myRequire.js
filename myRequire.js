/** 
 * _Modules对象以script的绝对路径作为key,
 * value为
 * {
      uid: src,           // script绝对路径
      dep: [],            // 当前script的执行依赖
      status: "start",    // 表示script的状态  start: 开始异步加载  wait: 正在等待所需依赖加载,回调还未执行  end:依赖加载完毕,回调已经执行
      resolves: [resolve] // 将Promise状态变为resolved的resolve函数组成的数组
    }
 * 
*/
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
    if (_Modules[src] && _Modules[src].status == "end") {
      // 当前src对应的js已经加载完依赖并执行了define的回调
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      if (!_Modules[src]) {
        _Modules[src] = {
          uid: src,
          dep: [],
          status: "start",
          resolves: [resolve]
        };
        loadJs(src);
      } else {
        // js已经load但还未执行
        _Modules[src].resolves.push(resolve);
      }
    });
  }

  /**
   * 返回一个Promise对象,当数组中的所有依赖都加载完之后,该Promise对象变为resolved
   * @param {Array} arr js路径组成的数组
   */
  function loadDepArrray(arr) {
    return Promise.all(
      arr.map(v => {
        return loadDep(v);
      })
    );
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
          if (failCb) {
            failCb(err);
          } else {
            console.error(err);
          }
        }
      );
    }
  }

  /**
   * 加载依赖,并声明当前js的导出值(供require使用)
   * @param {Array or Function} dep 依赖的js (也可以没有设置依赖,直接为成功的回调函数)
   * @param {Function} successCb 成功回调
   * @param {Function} failCb 失败回调
   */
  function _define(dep, successCb, failCb) {
    var src = document.currentScript.src,
      result = [];

    // 只有当前script是通过被require或者define所依赖时,才h执行下面的代码
    if (_Modules[src] && _Modules[src].status == "start") {
      // 如果当前js中如果执行了多个define函数,只有第一个define有效
      _Modules[src].status = "wait";
      if (Array.isArray(dep)) {
        _Modules[src].dep = dep;

        var check = checkCircleDependence(src);
        if (check.iscircle) {
          console.error("script exist loop dependence:\n", check.circleList.join(" => "));
          return;
        }
        loadDepArrray(dep).then(
          v => {
            _Modules[src].resolves.forEach(resolve => {
              resolve();
            });
            dep.forEach(fielname => {
              result.push(_Modules[getAbsolutePath(fielname)].result);
            });
            assign(_Modules[src], {
              status: "end",
              result: successCb.apply(null, result)
            });
          },
          err => {
            if (failCb) {
              failCb(err);
            } else {
              console.error(err);
            }
          }
        );
      } else if (isFunction(dep)) {
        _Modules[src].resolves.forEach(resolve => {
          resolve();
        });
        assign(_Modules[src], {
          status: "end",
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

  /**
   * 检查uid对应的script是否存在循环依赖的情况
   * @param {String} uid
   */
  function checkCircleDependence(uid) {
    var iscircle = false,
      circleList = [],
      path,
      len;
    (function check(dep, circleArr) {
      len = dep.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          path = getAbsolutePath(dep[i]);
          if (circleArr.indexOf(path) != -1) {
            iscircle = true;
            circleList = circleArr.concat(path);
            break;
          } else {
            if (_Modules[path] && _Modules[path].dep.length != 0) {
              check(_Modules[path].dep, circleArr.concat(path));
            }
          }
        }
      }
    })(_Modules[uid].dep, [uid]);
    return {
      iscircle: iscircle,
      circleList: circleList
    };
  }

  function loadJs(src) {
    var script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    console.log("load ", src);
  }
})();
