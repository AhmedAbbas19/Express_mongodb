const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const util = require("util");
const _ = require("lodash");
const { saltRound, jwtSecret } = require("../../config");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const userSchema = new Schema(
  {
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
    todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  },
  {
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, Number(saltRound));
  }
  next();
});

userSchema.methods.checkPassword = async function (plainPassword) {
  const user = this;
  return bcrypt.compare(plainPassword, user.password);
};

userSchema.methods.generateToken = function () {
  const user = this;
  return jwtSign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
};

userSchema.statics.getUserFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

module.exports = model("User", userSchema);
