const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database server is connected");
  })
  .catch(() => {
    console.log("Database connection faild");
  });
