const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { authentication, login, logout, register, resetPassword } = require('../controllers/auth');

router.get("/auth", auth, authentication);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/reset-password", auth, resetPassword);

module.exports = router;
