const express = require("express");
const {
  getLocation,
  getStudentTypes,
  addStudentType,
  deleteStudentType,
  getDistricts,
  getWards,
  getSubjects,
  addSubject,
  deleteSubject,
  getGrades,
  addGrade,
  deleteGrade,
  getSemesters,
  addSemester,
  deleteSemester,
  editStudentType,
} = require("../controllers/commonDataController");
const { auth } = require("../middleware/auth");
const { checkAdminRole } = require("../middleware/checkRole");
const router = express.Router();

router.get("/location", auth, getLocation);
router.post("/province/:id/get-districts", auth, getDistricts);
router.post("/district/:id/get-wards", auth, getWards);
router.get("/student-types", auth, getStudentTypes);
router.post("/add-student-type", checkAdminRole, addStudentType);
router.post("/edit-student-type", checkAdminRole, editStudentType);
router.post("/student-types/:id/delete", checkAdminRole, deleteStudentType);

router.get("/subjects", auth, getSubjects);
router.post("/add-subject", checkAdminRole, addSubject);
router.post("/subjects/:id/delete", checkAdminRole, deleteSubject);

router.get("/grades", auth, getGrades);
router.post("/add-grade", checkAdminRole, addGrade);
router.post("/grades/:id/delete", checkAdminRole, deleteGrade);

router.get("/semesters", auth, getSemesters);
router.post("/add-semester", checkAdminRole, addSemester);
router.post("/semesters/:id/delete", checkAdminRole, deleteSemester);

module.exports = router;
