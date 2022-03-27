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
  setNewPassword,
} = require("../controllers/authController");
const { getMySchedule, getCurrentUser } = require("../controllers/userController");
router.get("/auth", auth, authentication);
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", auth, getCurrentUser);
router.get("/logout", auth, logout);
router.get("/profile", auth, getUserProfile);
router.post("/profile/edit", auth, updateUserProfile);
router.post("/change-avatar", auth, updateAvatar);
router.post("/change-password", auth, changePassword);
router.get("/my-schedule", auth, getMySchedule);
router.post("/reset-password", resetPassword);
router.post("/set-new-password", setNewPassword);
module.exports = router;
