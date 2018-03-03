console.log("excute [b.js]");
define(["log"], function(log) {
  var world = function() {
    log("world");
  };
  console.log("excute callback [b.js]");
  return {
    world: world
  };
});
