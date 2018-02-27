var define, require;
(function() {
  var main = document.currentScript.getAttribute("data-main"),
    _Modules = {};

  function loadJs(src) {
    if (_Modules[src]) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      };
      script.src = src;
      document.body.appendChild(script);
    });
  }

  function loadDep(arr) {
    return arr.reduce((pre, current) => {
      return pre.then(() => {
        return loadJs(current);
      });
    }, Promise.resolve());
  }

  loadJs(main);

  /**
   *
   * @param {Array} dep 依赖的js
   * @param {Function} successCb 成功回调
   * @param {Function} failCb 失败回调
   */
  function _require(dep, successCb, failCb) {
    var result = [];
    if (Array.isArray(dep)) {
      loadDep(dep).then(
        v => {
          for (var k in _Modules) {
            result.push(_Modules[k].result);
          }
          successCb.apply(null, result);
        },
        err => {
          failCb(err);
        }
      );
    }
  }

  function _define(dep, successCb, failCb) {
    var src = document.currentScript.src,
      defineReturn,
      result = [];
    if (Array.isArray(dep)) {
      loadDep(dep).then(
        v => {
          for (var k in _Modules) {
            result.push(_Modules[k].result);
          }
          _Modules[src] = {
            uid: src,
            result: successCb.apply(null, result)
          };
        },
        err => {
          failCb(err);
        }
      );
    } else if (isFunction(dep)) {
      _Modules[src] = {
        uid: src,
        result: dep()
      };
    }
  }

  function isFunction(fn) {
    return typeof fn == "function";
  }

  define = _define;
  require = _require;
})();
