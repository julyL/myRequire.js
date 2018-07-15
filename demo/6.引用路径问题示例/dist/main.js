require(["./js/a.js"], function (a) {
  console.log("require回调:", a);
}, function () {
  console.error("Something wrong with the dependent modules.");
});
console.log('start main');