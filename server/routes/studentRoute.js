const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { addNewStudent, getStudents, getStudentInfo, editStudent } = require("../controllers/studentController");

router.post("/add-student", auth, addNewStudent);
router.post("/get-students", auth, getStudents);
router.post("/:id", auth, getStudentInfo);
router.post("/:id/edit", auth, editStudent);

module.exports = router;
