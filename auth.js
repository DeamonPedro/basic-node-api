const Router = require("koa-router");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { user } = require("./db");
const {
  INVALID_DATA,
  USER_NOT_FOUND,
  USER_ALREADY_REGISTERED,
  WRONG_PASSWORD,
  getStatusCodeByError,
} = require("./errors");
const router = new Router({ prefix: "/account" });

const getAccountData = async ({ email, pass }) => {
  if (email != null && pass != null) {
    const account = (await user.find({ email }))[0];
    if (account) {
      if (await bcrypt.compare(pass, account.pass)) {
        return account;
      } else {
        throw new Error(WRONG_PASSWORD);
      }
    } else {
      throw new Error(USER_NOT_FOUND);
    }
  } else {
    throw new Error(INVALID_DATA);
  }
};

const registerAccount = async ({ name, email, pass }) => {
  if (name != null && email != null && pass != null) {
    const account = await user.find({ email });
    if (account == 0) {
      await new user({
        name,
        email,
        pass: await bcrypt.hash(pass, parseInt(process.env.HASH_LEVEL)),
      }).save();
    } else {
      throw new Error(USER_ALREADY_REGISTERED);
    }
  } else {
    throw new Error(INVALID_DATA);
  }
};

const deleteAccount = async (userID) => {
  const account = await user.find({ _id: userID });
  if (account != 0) {
    await account[0].remove();
  } else {
    throw new Error(USER_NOT_FOUND);
  }
};

router.post("/signIn", async (ctx, next) => {
  try {
    const user = await getAccountData(ctx.request.body);
    ctx.status = 200;
    ctx.body = {
      token: jsonwebtoken.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        { noTimestamp: true, expiresIn: "1h" }
      ),
    };
  } catch (err) {
    ctx.status = getStatusCodeByError(err.message);
    ctx.body = {
      error: err.message,
    };
  }
});

router.post("/signUp", async (ctx, next) => {
  try {
    await registerAccount(ctx.request.body);
    ctx.status = 201;
    ctx.body = {
      status: "registered",
    };
  } catch (err) {
    ctx.status = getStatusCodeByError(err.message);
    ctx.body = {
      error: err.message,
    };
  }
});

router.delete("/delete", async (ctx, next) => {
  try {
    const userID = jsonwebtoken.decode(
      ctx.request.header.authorization.split(" ")[1],
      process.env.JWT_SECRET
    ).id;
    await deleteAccount(userID);
    ctx.status = 200;
    ctx.body = {
      status: "deleted",
    };
  } catch (err) {
    ctx.status = getStatusCodeByError(err.message);
    ctx.body = {
      error: err.message,
    };
  }
});

module.exports = router;
