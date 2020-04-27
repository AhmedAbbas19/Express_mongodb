const express = require("express");
require("./src/db/mongoose");
const userRouter = require("./src/Router/user.router");
const todoRouter = require("./src/Router/todo.router");
const morgan = require("morgan");
const { port } = require("./config");

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/users", userRouter);
app.use("/todos", todoRouter);

// Error Handler
app.use((error, req, res, next) => {
  console.log("Craashed", error.message);
  const msg = error.message;
  if (error.statusCode < 500) {
    res.status(error.statusCode).json({ ...error, msg });
  } else {
    res.json({ ...error, msg });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
