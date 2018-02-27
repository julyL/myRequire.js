// 最简单的例子
require(["a", "b"], function(a, b) {
  a.hello();
  b.world();
}, function() {
  console.error("Something wrong with the dependent modules.");
});
