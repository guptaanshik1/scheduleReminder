const User = require("../models/user");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token || req.body;
  // req.header("Authorization").replace("Bearer ", "");

  // if (!token) {
  //   return next(new CustomError("Login first to access this resource", 401));
  // }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id); // req object will carry the id of the logged in user

  if (!user) {
    return res.status(401).send("Login first to access this resource.")
  }
  req.token = token;
  req.user = user;
  // console.log(req.user)
  next();
});

exports.customRole = (...roles) => {
  // whatever the role gonna come like admin or manager it will be spreaded in the array
  // 'admin' - ['admin']

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // if the roles array does not have role of the current user then return
      return res.status(403).send("You are not allowed to access this resource.")
    }
    next();
  };
};
