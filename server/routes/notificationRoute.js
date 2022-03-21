const express = require("express");
const { getNotification } = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/get-notifications", auth, getNotification);

module.exports = router;
