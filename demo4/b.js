console.log("excute [b.js]");
define(["c"], function(c) {
  console.log("excute callback [b.js]");

  require(["a"], function() {
    console.log("此时回调不会执行");
  }, function(err) {
    console.log(err);
  });

  return {};
});
