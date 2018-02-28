// 最简单的例子
require(["a", "b"], function(a, b) {
  a.hello();
  b.world();
}, function(err) {
  console.error(err, "Something wrong with the dependent modules.");
});
