const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  authentication,
  login,
  logout,
  register,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  changePassword,
} = require("../controllers/authController");
const { getMySchedule } = require("../controllers/userController");

router.get("/auth", auth, authentication);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.post("/profile", auth, getUserProfile);
router.post("/profile/edit", auth, updateUserProfile);
router.post("/change-avatar", auth, updateAvatar);
router.post("/change-password", auth, changePassword);
router.post("/my-schedule", auth, getMySchedule);
//router.get("/reset-password", auth, resetPassword);

module.exports = router;
