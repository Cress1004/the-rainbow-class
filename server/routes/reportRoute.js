const express = require("express");
const { newReport } = require("../controllers/reportController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/new-report", auth, newReport);

module.exports = router;
