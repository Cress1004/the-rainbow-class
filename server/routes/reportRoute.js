const express = require("express");
const {
  newReport,
  getReportByPairAndMonth,
} = require("../controllers/reportController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/new-report", auth, newReport);
router.post("/get-reports-by-pair", auth, getReportByPairAndMonth);

module.exports = router;
