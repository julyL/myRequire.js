console.log("excute [a.js]");
define(["b"], function() {
  console.log("excute callback [a.js]");
  return {};
});
