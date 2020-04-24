const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: [3, "too short"],
    maxlength: [15, "too long"],
  },
  age: {
    type: Number,
    min: [13, "too young"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
