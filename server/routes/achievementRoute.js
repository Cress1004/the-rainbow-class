const express = require("express");
const {
  getAchievementByStudent, getAchievementSemesterByStudent,
} = require("../controllers/achievementController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/get-achievement-student/", auth, getAchievementByStudent);
router.post("/get-achievement-student-semester/", auth, getAchievementSemesterByStudent);

module.exports = router;
