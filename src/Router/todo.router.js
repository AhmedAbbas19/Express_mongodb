const express = require("express");
const Todo = require("../models/todo");
const User = require("../models/user");

const router = express.Router();

router.post("/", (req, res, next) => {
  const user = User.findOne({ username: req.body.username })
    .then((user) => {
      const todo = new Todo({
        userId: user._id,
        title: req.body.title,
        tags: req.body.tags,
      });
      return todo.save();
    })
    .then((todo) => {
      delete todo._id;
      res.send(todo);
    })
    .catch((e) => {
      next(e);
    });
});

router.get("/:id", (req, res, next) => {
  Todo.find({ userId: req.params.id }, { userId: 0, _id: 0 })
    .then((todos) => {
      res.send(todos);
    })
    .catch((e) => {
      next(e);
    });
});

router.delete("/:id", (req, res, next) => {
  Todo.deleteOne({ _id: req.params.id })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res.status(404).send({ message: "Todo not found" });
      }
      res.send({ message: "Todo was deleted successfully" });
    })
    .catch((e) => {
      next(e);
    });
});

router.patch("/:id", (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "status", "tags"];
  const isValidOperation = updates.every((u) => allowedUpdates.includes(u));
  if (isValidOperation) {
    Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((todo) => {
        if (!todo) {
          return res.status(404).send({ message: "Todo not found" });
        }
        res.send({ message: "Todo was updated successfully", todo });
      })
      .catch((e) => {
        next(e);
      });
  } else {
    next({ message: "Invalid update!" });
  }
});

module.exports = router;
