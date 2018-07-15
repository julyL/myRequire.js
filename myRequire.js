/**
 * Created by julyL
 */
(function (global) {

  const _Modules = {};

  /**
   * 返回一个Promise, 当filepath的所有依赖模块加载之后变为resolved
   * @param {*} filepath
   * @returns Promise
   */
  function loadDep(filepath) {
    var src = getAbsolutePath(filepath);
    if (_Modules[src] && _Modules[src].status == "end") {
      // filepath的所有依赖模块已经执行define的回调
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
        return loadJs(src);
      } else {
        // 当前依赖已经被引入了
        _Modules[src].resolves.push(resolve);
      }
    });
  }

  /**
   * 当数组中的所有依赖都加载完之后, 该Promise对象变为resolved
   * @param {Array} arr 依赖模块组成的数组
   * @returns Promise
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
      loadDepArrray(dep).then(v => {
          // 将各个依赖的执行结果放入result中
          dep.forEach(filepath => {
            let path = getAbsolutePath(filepath);
            result.push(_Modules[path].result);
          });
          successCb.apply(null, result);
        },
        err => {
          if (failCb) {
            failCb(err);
          } else {
            console.error("[myRequire] error:", err);
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

    // 只有当前script是通过被require或者define所依赖时,才会执行下面的代码
    if (_Modules[src] && _Modules[src].status == "start") {

      // 每个js文件执行多次define时只有第一个执行的define有效
      _Modules[src].status = "wait";

      if (Array.isArray(dep)) {
        _Modules[src].dep = dep;

        // 检测是否存在循环依赖
        var check = checkCircularDependencies(src);
        if (check.iscircle) {
          console.error("[myRequire]: script exist circular dependencies:\n", check.circleList.join(" => "));
          return;
        }

        loadDepArrray(dep).then(v => {
            // 执行依赖模块resolves中所有resolve函数,借此通知所有依赖当前模块的【父模块】,当前模块已经执行完毕,可以进行后续操作 
            _Modules[src].resolves.forEach(resolve => {
              resolve();
            });

            // 将各个依赖的执行结果放入result中
            dep.forEach(filepath => {
              let path = getAbsolutePath(filepath);
              result.push(_Modules[path].result);
            });

            _Modules[src].status = "end";
            _Modules[src].result = successCb.apply(null, result); // 传入依赖执行结果,执行回调

          },
          err => {
            if (failCb) {
              failCb(err);
            } else {
              console.error("[myRequire] error:", err);
            }
          }
        );
      } else if (isFunction(dep)) { // 没有依赖只传了回调的情况
        _Modules[src].resolves.forEach(resolve => {
          resolve();
        });

        _Modules[src].status = "end";
        _Modules[src].result = dep();

      }
    }
  }

  /**
   * TODO:
   * 返回引用的js的绝对路径
   * @param {String} filepath
   * @returns {String}
   */
  function getAbsolutePath(filepath) {
    // http,https直接返回
    if (/^https?/.test(filepath)) {
      return filepath
    }

    var div = document.createElement("div"),
      href;

    div.innerHTML = "<a href=./></a>";
    // 获取当前页面绝对路径
    href = div.firstChild.href;

    // 自动添加.js后缀
    if (!/^.+\.js$/.test(filepath)) {
      filepath = filepath + ".js";
    }

    // 将'./a.js'和'/a.js'转换为'a.js'
    filepath = filepath.replace(/^(\.)?\//, "");

    // 处理'../'
    var matchList = filepath.match(/\.\.\//g);
    if (matchList == null) {
      return href + filepath;
    } else {
      var s = href.split("/");
      s = s.slice(0, -(matchList.length + 1));
      return s.join("/") + "/" + filepath.replace("../", "");
    }
  }

  function isFunction(fn) {
    return typeof fn == "function";
  }

  /**
   * 检测js是否存在循环依赖
   * @param {String} src
   * @returns {Object}
   */
  function checkCircularDependencies(src) {
    var iscircle = false,
      circleList = [];
    (function check(dep, circleArr) {
      let len = dep.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let path = getAbsolutePath(dep[i]);
          // circleArr存放当前模块的所有依赖,如果新加载的模块已经存在于circleArr,说明存在【循环依赖】的情况
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
    })(_Modules[src].dep, [src]);
    return {
      iscircle: iscircle, // 是否循环
      circleList: circleList // 循环依赖模块组成的队列
    };
  }

  /**
   * 加载js文件
   * @param {string} src js路径
   */
  function loadJs(src) {
    var script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = () => {
        console.log("[myRequire]: load ", src);
        resolve();
      }
      script.onerror = () => {
        console.log("[myRequire]: load fail ", src);
        reject();
      }
    })
  }

  var main = document.currentScript.getAttribute("data-main");

  // 根据data-main加载入口文件
  loadJs(main);
  global.define = _define;
  global.require = _require;

})(window);