const express = require("express");
const { updateCommentStudent } = require("../controllers/achievementController");
const {
  addClass,
  getClassData,
  deleteClassData,
  editClassData,
  getClassSchedule,
  getAllClasses,
  setClassMonitor,
  getStudentWithAchievementByClass,
  getListClassWithName,
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
  checkAdminRole,
} = require("../middleware/checkRole");
const router = express.Router();

router.post("/add-class", checkAdminRole, addClass);
router.post("/get-all-classes", auth, getAllClasses);
router.post("/get-list-class-with-name", getListClassWithName);
router.post("/comment-student", checkAdminAndMonitorRole, updateCommentStudent);
router.post("/my-class-schedules", auth, getMyClasschedule);
router.post("/get-class-schedules", auth, getClassSchedule);
router.post("/:id", auth, getClassData);
router.post("/:id/set-monitor", checkAdminRole, setClassMonitor);
router.post("/:id/delete", checkAdminRole, deleteClassData);
router.post("/:id/edit", checkAdminAndMonitorRole, editClassData);
router.post("/:id/add-lesson", checkAdminAndMonitorRole, addLesson);
router.post("/:id/get-lessons", auth, getListLessonByClass);
router.post("/:id/get-students", auth, getStudentWithAchievementByClass);
router.post("/:id/lessons/:lessonId", auth, getLessonData);
router.post("/:id/lessons/:lessonId/delete", auth, deleteLessonData);
router.post("/:id/lessons/:lessonId/edit", auth, editLessonData);
router.post("/:id/lessons/:lessonId/assign", auth, assignLesson);
router.post("/:id/lessons/:lessonId/unassign", auth, unassignLesson);

module.exports = router;
