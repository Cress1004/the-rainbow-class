const express = require("express");
const router = express.Router();
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const {
  addNewStudent,
  getStudents,
  getStudentInfo,
  editStudent,
  deleteStudentData,
  updateStudentOverview,
  changeStudentStatus,
  getStudentsDataByFilter,
} = require("../controllers/studentController");

router.post("/add-student", checkAdminAndMonitorRole, addNewStudent);
router.get("/get-students", auth, getStudents);
router.get("/:id", auth, getStudentInfo);
router.post(
  "/:id/change-status",
  checkAdminAndMonitorRole,
  changeStudentStatus
);
router.post("/:id/edit", checkAdminAndMonitorRole, editStudent);
router.get("/:id/delete", checkAdminAndMonitorRole, deleteStudentData);
router.post(
  "/:id/update-overview",
  checkAdminAndMonitorRole,
  updateStudentOverview
);
router.post("/filter", auth, getStudentsDataByFilter);

module.exports = router;
