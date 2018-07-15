console.log("excute [b.js]");
define(["c"], function (c) {
  console.log("excute callback [b.js]");
  console.log("b.js引用的c: " + c);

  require(["a"], function () {
    console.log("执行回调--a1");
  }, function (err) {
    console.log(err);
  });

  require(["a"], function () {
    console.log("执行回调--a2");
  }, function (err) {
    console.log(err);
  });

  return {};
});