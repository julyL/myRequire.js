// 最简单的例子
require(["a"], function(a) {
  console.log("excute main");
}, function(err) {
  console.error(err, "Something wrong with the dependent modules.");
});
