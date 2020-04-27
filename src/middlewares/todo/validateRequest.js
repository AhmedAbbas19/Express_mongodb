const validUpdateReuest = (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "status", "tags"];
  const isValidOperation = updates.every((u) => allowedUpdates.includes(u));

  if (!isValidOperation) {
    next({ message: "Invalid update field!" });
  }
  next();
};

module.exports = {
  validUpdateReuest,
};
