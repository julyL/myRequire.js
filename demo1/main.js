// 最简单的例子
debugger;
require(["./a.js", "./b.js"], function(a, b) {
  a.hello();
  b.world();
}, function() {
  console.error("Something wrong with the dependent modules.");
});
