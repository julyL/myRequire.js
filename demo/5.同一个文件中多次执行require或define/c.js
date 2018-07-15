console.log("excute [c.js]");

define(function () {
  console.log("excute callback [c.js] -- c1");
  return 'c1'
});

define(function () {
  console.log("excute callback [c.js] -- c2");
  return 'c2'
});