const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [40, "Name should not be more than 40 characters"],
  },
  age: {
    type: Number,
    required: [true, "Age is Required"],
    min: [6, "Age should be more than 6"],
    max: [100, "Age should be less than 100"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Email should be in proper format"],
    required: [true, "Email is required"],
    unique: [true, "Email already in use"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password shou greater than 6 characters"],
    select: false,
  },
  occupation: {
    type: String,
    required: [true, "Occupation cannot be empty"],
  },
  profilePicture: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  // pre takes a method of mongoose like save create
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidatedPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      role: this.role,
      profilePicture: this.profilePicture,
      age: this.age,
      email: this.email,
      occupation: this.occupation,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.forgotPasswordTokenExpiry =
    Date.now() + process.env.FORGOTPASSWORDEXPIRY * 60 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);