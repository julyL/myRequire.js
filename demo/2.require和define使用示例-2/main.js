require(["a", "b"], function (a, b) {
  console.log("require回调:", a, b);
}, function () {
  console.error("Something wrong with the dependent modules.");
});
console.log('start main');