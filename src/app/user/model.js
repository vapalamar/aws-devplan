const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fistName: String,
  lastName: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
