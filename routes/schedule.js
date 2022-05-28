const express = require("express");
const router = express.Router();

const {
  addSchedule,
  getOneUserSchedules,
  getOneUserOneSchedule,
  toggleImportant,
  toggleCompleted,
  updateOneSchedule,
  deleteOneSchedule,
  adminGetOneUserSchedules,
  adminGetOneSchedule,
  adminDeleteOneSchedule,
} = require("../controllers/scheduleController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/schedule/add").post(isLoggedIn, addSchedule);
router.route("/schedules").get(isLoggedIn, getOneUserSchedules);
router
  .route("/schedule/:id")
  .get(isLoggedIn, getOneUserOneSchedule)
  .put(isLoggedIn, updateOneSchedule)
  .delete(isLoggedIn, deleteOneSchedule);

router.route("/toggleimportant/:id").put(isLoggedIn, toggleImportant);
router.route("/togglecompleted/:id").put(isLoggedIn, toggleCompleted);

router
  .route("/admin/userschedules/:id") // in this user id will be sent in the params
  .get(isLoggedIn, customRole("admin"), adminGetOneUserSchedules);
router
  .route("/admin/schedule/:id")
  .get(isLoggedIn, customRole("admin"), adminGetOneSchedule)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneSchedule);

module.exports = router;