const express = require("express");
const User = require("../models/user");
const Todo = require("../models/todo");

const router = express.Router();

router.get("/", (req, res, next) => {
  User.find({}, { firstName: 1, _id: 0 })
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      next(e);
    });
});

router.post("/register", (req, res, next) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.send({ message: "user was registered successfully" });
    })
    .catch((e) => {
      res.statusCode = 400;
      next(e);
    });
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const todos = await Todo.find({ userId: user._id }, { _id: 0, userId: 0 });
    res.send({
      message: "Logged in successfully",
      username: user.username,
      todos,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send({ message: "User was deleted successfully" });
    })
    .catch((e) => {
      next(e);
    });
});

router.patch("/:id", (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userName", "firstName", "age", "password"];
  const isValidOperation = updates.every((u) => allowedUpdates.includes(u));
  if (isValidOperation) {
    User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User was updated successfully", user });
      })
      .catch((e) => {
        next(e);
      });
  } else {
    next({ message: "Invalid update!" });
  }
});

module.exports = router;
