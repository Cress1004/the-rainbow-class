const express = require("express");
const router = express.Router();
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const { addNewStudent, getStudents, getStudentInfo, editStudent, deleteStudentData } = require("../controllers/studentController");

router.post("/add-student", auth, addNewStudent);
router.post("/get-students", auth, getStudents);
router.post("/:id", auth, getStudentInfo);
router.post("/:id/edit", checkAdminAndMonitorRole, editStudent);
router.post("/:id/delete", checkAdminAndMonitorRole, deleteStudentData)

module.exports = router;
