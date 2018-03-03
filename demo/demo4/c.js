console.log("excute [c.js]");

define(function(c) {
  console.log("excute callback [c.js] -- c1");
  return {
    c: "c1"
  };
});

define(function(c) {
  console.log("excute callback [c.js] -- c2");
  return {
    c: "c2"
  };
});
