const express = require("express");
require("./src/db/mongoose");
const userRouter = require("./src/Router/user.router");
const todoRouter = require("./src/Router/todo.router");
const morgan = require("morgan");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(morgan("combined"));
app.use("/users", userRouter);
app.use("/todos", todoRouter);

// Error Handler
app.use((error, req, res, next) => {
  if (res.statusCode < 500) {
    res.send(error.message);
  } else {
    res.send("Something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
