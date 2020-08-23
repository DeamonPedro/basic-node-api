const mongoose = require("mongoose");
const usersSchema = require("./schemas/users");

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.model("users", usersSchema);

module.exports = {
  user: mongoose.model("users"),
};
