define(function() {
  return function() {
    console.log("\n============\nlogger:\n============\n");
    console.log.apply(console, [].slice.call(arguments));
  };
});
