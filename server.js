var Koa = require("koa"),
  static = require("koa-static");
var app = new Koa();

app.use(static("."));

app.use(async (ctx, next) => {
  next();
});

app.listen(3000);
console.log("[demo] start-quick is starting at port 3000");
