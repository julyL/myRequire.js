console.log("excute [b.js]");
define(["c"], function(c) {
  console.log("excute callback [b.js]");
  require(["a"], function() {
    console.log("执行回调a");
  }, function(err) {
    console.log(err);
  });

  return {};
});
