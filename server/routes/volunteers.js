const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { route } = require('./common-data');

//router.get("/reset-password", auth, resetPassword);

module.exports = router;
