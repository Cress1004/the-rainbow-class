const express = require("express");
const {
  addNewQuestion,
  getAllCVQuestions,
  editQuestion,
  deleteQuestion,
  getQuestionForCV,
} = require("../controllers/cvQuestionController");
const { checkAdminAndMonitorRole } = require("../middleware/auth");
const router = express.Router();

router.get("/", checkAdminAndMonitorRole, getAllCVQuestions);
router.get("/get-questions", getQuestionForCV);
router.post("/add", checkAdminAndMonitorRole, addNewQuestion);
router.post("/:id/edit", checkAdminAndMonitorRole, editQuestion);
router.post("/delete/:id/", checkAdminAndMonitorRole, deleteQuestion);

module.exports = router;
