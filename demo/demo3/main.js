require(["a", "b"], function(a, b) {
  console.log("excute main");
}, function(err) {
  console.error(err, "Something wrong with the dependent modules.");
});
