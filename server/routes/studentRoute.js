const express = require("express");
const router = express.Router();
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const { addNewStudent, getStudents, getStudentInfo, editStudent, deleteStudentData, updateStudentOverview } = require("../controllers/studentController");

router.post("/add-student", checkAdminAndMonitorRole, addNewStudent);
router.get("/get-students", auth, getStudents);
router.get("/:id", auth, getStudentInfo);
router.post("/:id/edit", checkAdminAndMonitorRole, editStudent);
router.get("/:id/delete", checkAdminAndMonitorRole, deleteStudentData);
router.post("/:id/update-overview", checkAdminAndMonitorRole, updateStudentOverview);

module.exports = router;
