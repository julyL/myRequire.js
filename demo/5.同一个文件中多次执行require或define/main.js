require(["a"], function(a) {
  console.log("excute main--1");
}, function(err) {
  console.error(err, "Something wrong with the dependent modules.");
});

require(["a"], function(a) {
  console.log("excute main--2");
}, function(err) {
  console.error(err, "Something wrong with the dependent modules.");
});
