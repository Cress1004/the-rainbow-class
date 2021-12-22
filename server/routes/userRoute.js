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
} = require("../controllers/authController");

router.get("/auth", auth, authentication);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.post("/profile", auth, getUserProfile);
router.post("/profile/edit", auth, updateUserProfile);
//router.get("/reset-password", auth, resetPassword);

module.exports = router;
