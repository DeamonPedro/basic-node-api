const mongoose = require("mongoose");

module.exports = mongoose.Schema({
  name: String,
  email: String,
  pass: String,
});
