const express = require("express");
const router = express.Router();

const {
  verifyEmail,
  signup,
  login,
  uploadImage,
  logout,
  forgotPassword,
  resetPassword,
  getLogggedInUserDetails,
  updatePassword,
  updateProfilePicture,
  removePic,
  updateUserDeatils,
  adminGetAllUsers,
  adminGetOneUser,
  adminUpdateOneUser,
  adminDeleteOneUser,
} = require("../controllers/userController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/verify").post(verifyEmail);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/upload/:id").post(isLoggedIn, uploadImage);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLogggedInUserDetails);
router.route("/updatepassword").post(isLoggedIn, updatePassword);
router
  .route("/userdashboard/updateimage")
  .put(isLoggedIn, updateProfilePicture);
router.route("/userdashboard/deleteimage").delete(isLoggedIn, removePic);
router.route("/userdashboard/update").put(isLoggedIn, updateUserDeatils);

router
  .route("/admin/users")
  .get(isLoggedIn, customRole("admin"), adminGetAllUsers);

router
  .route("/admin/user/:id")
  .get(adminGetOneUser)
  .put(isLoggedIn, customRole("admin"), adminUpdateOneUser)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);

module.exports = router;