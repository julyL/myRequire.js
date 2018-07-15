define(["./c"], function (c) {
  console.log('执行a回调');
  return {
    a: 'aaa',
    c: c
  };
});