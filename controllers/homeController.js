const BigPromise = require("../middlewares/bigPromise");

exports.home = BigPromise(async (req, res, next) => {
  // res.send('Welcome')

  res.status(200).json({
    success: true,
    message: "Welcome to time manager",
  });
});