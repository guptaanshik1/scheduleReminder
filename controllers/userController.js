const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const cookieToken = require("../utils/cookieToken");
const emailHelper = require("../utils/emailHelper");

exports.verifyEmail = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const isEmailInDb = await User.findOne({ email });
  if (isEmailInDb) {
    return res.status(400).json("Email Already Verified");
  }
  const otpGenerated = Math.floor(100000 + Math.random() * 900000).toString();
  // console.log(email)

  try {
    await emailHelper({
      // this is the option object
      email,
      subject: "Email Verification",
      message: `Enter the following OTP to verify your email: ${otpGenerated}`,
    });
  } catch (error) {
    return res.status(405).send("Email cannot be sent.");
  }

  res.status(200).json({
    success: true,
    message: "Verification email has been sent succefully",
    otp: otpGenerated,
  });
});

exports.signup = BigPromise(async (req, res, next) => {
  const { name, age, email, password, occupation } = req.body;

  if (!name || !age || !email || !password || !occupation) {
    return res.status(400).send("Mandatory fields are required");
  }

  const user = await User.create({
    name,
    age,
    email,
    password,
    occupation,
  });

  try {
    await emailHelper({
      // this is the option object
      email,
      subject: "Welcome to Time Manager.",
      message: "You have successfully registered.",
    });
  } catch (error) {
    return res.status(405).send("Email cannot be sent");
  }

  cookieToken(user, res);
});

exports.uploadImage = BigPromise(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  let result;
  // console.log(profilePicture)
  if (req.files) {
    const { profilePicture: file } = req.files;
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "timeManagerProfilePics",
      width: 100,
      crop: "scale",
    });
  }

  const dataToBeChanged = {
    profilePicture: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  };

  user = await User.findByIdAndUpdate(req.params.id, dataToBeChanged, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Mandatory fields are required.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send("Email or password does not match");
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return res.status(400).send("Email or password does not match");
  }
  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have been logged out successfully",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("This email does not exist.");
  }

  const token = user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  const forgotMailUrl = `${req.protocol}://${req.get(
    "host"
  )}api/v1/password/reset/${token}`;

  const message = `Copy paste this link in the browser ${forgotMailUrl}`;

  try {
    await emailHelper({
      email,
      subject: "Password reset email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset mail has been sent",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(400).send(error);
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryptToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  // res.status(200).json({ user })

  if (!user) {
    return res.status(400).send("Invalid token.");
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).send("Mandatory fields are required.");
  }

  user.password = password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  cookieToken(user, res);
});

exports.getLogggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword)

  isOldPasswordCorrect = await user.isValidatedPassword(oldPassword);

  if (!isOldPasswordCorrect) {
    return res.status(400).send("Old password does not match.");
  }

  user.password = newPassword;
  await user.save();

  cookieToken(user, res);
});

exports.updateProfilePicture = BigPromise(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  if (req.files) {
    const pictureId = user.profilePicture.id;
    const response = await cloudinary.uploader.destroy(pictureId);

    const { profilePicture: file } = req.files;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "timeManagerProfilePics",
      width: 100,
      crop: "scale",
    });
    const dataToBeChanged = {
      profilePicture: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    };

    user = await User.findByIdAndUpdate(req.user.id, dataToBeChanged, {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Image updated",
    user,
  });
});

exports.updateUserDeatils = BigPromise(async (req, res, next) => {
  const { id: userId } = req.user;
  const { name, age, email, occupation } = req.body;

  const newData = {
    name,
    age,
    email,
    occupation,
  };

  const user = await User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.removePic = BigPromise(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  if (user.profilePicture.id) {
    const pictureId = user.profilePicture.id;
    const response = await cloudinary.uploader.destroy(pictureId);

    user.profilePicture.id = undefined;
    user.profilePicture.secure_url = undefined;

    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Profile Picture has been removed successfully",
    user,
  });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).send("This user does not exist.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminGetAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminUpdateOneUser = BigPromise(async (req, res, next) => {
  const { name, age, email, occupation } = req.body;

  const newData = {
    name,
    age,
    email,
    occupation,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User has been deleted successfully",
  });
});
