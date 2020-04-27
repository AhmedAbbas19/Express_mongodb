const express = require("express");
const User = require("../models/user");
const Todo = require("../models/todo");
const CustomeError = require("../helper/custome-error");
const {
  validateLoginRequist,
  validateRegisterRequist,
  validUpdateReuest,
} = require("../middlewares/user/validateRequest");
const Authorization = require("../middlewares/user/authorization");
require("express-async-errors");

const router = express.Router();

router.get("/", Authorization, async (req, res) => {
  const users = await User.find({}, { firstName: 1, _id: 0 });
  res.json(users);
});

router.post("/register", validateRegisterRequist, async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "user was registered successfully" });
});

router.post("/login", validateLoginRequist, async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    throw new CustomeError("User not found", 401);
  }
  console.log(req.body.password);

  const matchPassword = await user.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomeError("Incorrect Password", 401);
  }
  const token = await user.generateToken();
  const todos = await Todo.find({ userId: user._id }, { _id: 0, userId: 0 });
  res.json({
    message: "Logged in successfully",
    username: user.username,
    token,
    todos,
  });
});

router.get("/profile", Authorization, async (req, res) => {
  res.json(req.user);
});

router.delete("/", Authorization, async (req, res) => {
  const { deletedCount } = await User.deleteOne({ _id: req.user.id });
  if (!deletedCount) {
    throw new CustomeError("User not found", 401);
  }
  res.json({ message: "User was deleted successfully" });
});

router.patch("/", Authorization, validUpdateReuest, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  const updates = Object.keys(req.body);
  updates.forEach((update) => (user[update] = req.body[update]));
  await user.save();
  res.json({ message: "User was updated successfully", user });
});

module.exports = router;
