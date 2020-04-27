const { check, validationResult } = require("express-validator");
const CustomeError = require("../../helper/custome-error");

const validateLoginRequist = [
  check("username").notEmpty().withMessage("username is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomeError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateRegisterRequist = [
  check("username").notEmpty().withMessage("username is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  check("firstName").notEmpty().withMessage("firstName is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomeError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validUpdateReuest = (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userName", "firstName", "age", "password"];
  const isValidOperation = updates.every((u) => allowedUpdates.includes(u));
  if (!isValidOperation) {
    throw new CustomeError("Invalid update field!", 422);
  }
  next();
};

module.exports = {
  validateLoginRequist,
  validateRegisterRequist,
  validUpdateReuest,
};
