require("dotenv").config();
const koaBody = require("koa-body");
const jwt = require("koa-jwt");
const Koa = require("koa");
const { AUTHENTICATION_ERROR } = require("./errors");

const auth = require("./auth");

const app = new Koa();

app.use(koaBody());
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
