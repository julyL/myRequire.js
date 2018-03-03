console.log("excute [a.js]");
define(["../logger"], function(logger) {
  var hello = function() {
    logger("hello");
  };
  console.log("excute callback [a.js]");
  return {
    hello: hello
  };
});
