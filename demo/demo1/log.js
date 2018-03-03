define(function() {
  return function() {
    console.log.apply(console, [].slice.call(arguments));
  };
});
