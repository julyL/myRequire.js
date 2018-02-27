console.log("excute [a.js]");
define(["./log.js"], function(log) {
  var world = function() {
    log("world");
  };
  console.log("excute callback [a.js]");
  return {
    world: world
  };
});
