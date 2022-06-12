const express = require("express");
const { getNotification, updateNotiStatus } = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/get-notifications", auth, getNotification);
router.get("/:id", auth, updateNotiStatus)

module.exports = router;
