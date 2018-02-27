console.log("excute [a.js]");
define(["./log.js"], function(log) {
  var hello = function() {
    log("hello");
  };
  console.log("excute callback [a.js]");
  return {
    hello: hello
  };
});
