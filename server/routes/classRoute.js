const express = require("express");
const {
  addClass,
  getClasses,
  getClassData,
  deleteClassData,
  editClassData,
  getClassSchedule,
  getAllClasses,
} = require("../controllers/classController");
const {
  addLesson,
  getListLessonByClass,
  getLessonData,
  deleteLessonData,
  editLessonData,
  assignLesson,
  unassignLesson,
} = require("../controllers/lessonController");
const { getMyClasschedule } = require("../controllers/userController");
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const {
  checkAdminAndVolunteerRole,
  checkAdminRole,
} = require("../middleware/checkRole");
const router = express.Router();

router.post("/add-class", checkAdminRole, addClass);
router.post("/get-classes", auth, getClasses);
router.post("/get-all-classes", checkAdminAndVolunteerRole, getAllClasses);
router.post("/my-class-schedules", auth, getMyClasschedule);
router.post("/get-class-schedules", auth, getClassSchedule);
router.post("/:id", auth, getClassData);
router.post("/:id/delete", checkAdminRole, deleteClassData);
router.post("/:id/edit", checkAdminAndMonitorRole, editClassData);
router.post("/:id/add-lesson", auth, addLesson);
router.post("/:id/get-lessons", auth, getListLessonByClass);
router.post("/:id/lessons/:lessonId", auth, getLessonData);
router.post("/:id/lessons/:lessonId/delete", auth, deleteLessonData);
router.post("/:id/lessons/:lessonId/edit", auth, editLessonData);
router.post("/:id/lessons/:lessonId/assign", auth, assignLesson);
router.post("/:id/lessons/:lessonId/unassign", auth, unassignLesson);

module.exports = router;
