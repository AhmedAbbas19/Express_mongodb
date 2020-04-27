const mongoose = require("mongoose");
const _ = require("lodash");

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      index: true,
      minlength: [5, "too short"],
      maxlength: [20, "too long"],
    },
    status: {
      type: String,
      default: "to-do",
      enum: ["to-do", "done", "in progress"],
    },
    tags: [
      {
        tag: {
          type: String,
          maxlength: [10, "too long"],
        },
      },
    ],
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v"]),
    },
  }
);

module.exports = mongoose.model("Todo", todoSchema);
