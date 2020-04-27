const express = require("express");
require("express-async-errors");
const Todo = require("../models/todo");
const CustomeError = require("../helper/custome-error");
const Authorization = require("../middlewares/user/authorization");

const { validUpdateReuest } = require("../middlewares/todo/validateRequest");

const router = express.Router();

router.post("/", Authorization, async (req, res) => {
  const todo = new Todo({
    userId: req.user._id,
    title: req.body.title,
    tags: req.body.tags,
  });
  await todo.save();
  res.send(todo);
});

router.get("/", Authorization, async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  res.send(todos);
});

router.delete("/:id", Authorization, async (req, res) => {
  const { deletedCount } = await Todo.deleteOne({ _id: req.params.id });
  if (!deletedCount) {
    throw new CustomeError("Todo not found", 401);
  }
  res.json({ message: "Todo was deleted successfully" });
});

router.patch("/:id", Authorization, validUpdateReuest, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    throw new CustomeError("Todo not found", 401);
  }

  if (!req.user._id.equals(todo.userId)) {
    throw new CustomeError("Unauthorized", 401);
  }
  const updates = Object.keys(req.body);
  updates.forEach((update) => (todo[update] = req.body[update]));
  await todo.save();
  res.json({ message: "Todo was updated successfully", todo });
});

module.exports = router;
