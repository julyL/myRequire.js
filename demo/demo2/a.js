console.log("excute [a.js]");
define(["b"], function(world) {
  world();
  console.log("excute callback [a.js]");
  return {
    hello: hello
  };
});
