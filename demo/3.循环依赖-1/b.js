console.log("excute [b.js]");
define(["a"], function (hello) {
  hello();
  console.log("excute callback [b.js]");
  return {
    world: world
  };
});