require("dotenv").config();
const ratelimit = require("koa-ratelimit");
const koaBody = require("koa-body");
const jwt = require("koa-jwt");
const Koa = require("koa");
const { AUTHENTICATION_ERROR } = require("./errors");

const auth = require("./auth");

const app = new Koa();
const db = new Map();

app.use(
  ratelimit({
    driver: "memory",
    db: db,
    duration: 60000,
    errorMessage: "too many requests",
    id: (ctx) => ctx.ip,
    headers: {
      remaining: "Rate-Limit-Remaining",
      reset: "Rate-Limit-Reset",
      total: "Rate-Limit-Total",
    },
    max: 50,
    disableHeader: false,
  })
);
app.use(koaBody());
app.use((ctx, next) => {
  return next().catch((err) => {
    ctx.status = 401;
    ctx.body = {
      error: AUTHENTICATION_ERROR,
    };
  });
});
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    key: process.env.JWT_SECRET,
  }).unless({
    path: ["/account/signIn", "/account/signUp"],
  })
);
app.use(auth.routes());
app.listen(3000);

module.exports = app;
