const express = require("express");
const {
  newReport,
  getReportByPairAndMonth,
  teachByClassNewReport,
  getReportByVolunteerAndMonth,
  getReportByClassAndMonth,
} = require("../controllers/reportController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/new-report", auth, newReport);
router.post("/get-reports-by-pair", auth, getReportByPairAndMonth);
router.post("/teach-by-class-new-report", auth, teachByClassNewReport);
router.post("/get-reports-by-volunteer", auth, getReportByVolunteerAndMonth);
router.post("/get-reports-by-class", auth, getReportByClassAndMonth);

module.exports = router;
