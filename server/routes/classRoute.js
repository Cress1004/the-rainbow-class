const express = require("express");
const {
  updateCommentStudent,
} = require("../controllers/achievementController");
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
  getAdminAndCurrentMonitor,
  getPairTeaching,
  newPairTeaching,
  setPairVolunteer,
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
const { checkAdminRole } = require("../middleware/checkRole");
const router = express.Router();

router.post("/add-class", checkAdminRole, addClass);
router.get("/get-all-classes", auth, getAllClasses);
router.get("/get-list-class-with-name", getListClassWithName);
router.post("/comment-student", checkAdminAndMonitorRole, updateCommentStudent);
router.get("/my-class-schedules", auth, getMyClasschedule);
router.post("/get-class-schedules", auth, getClassSchedule);
router.get("/:id", auth, getClassData);
router.get(
  "/:id/get-admin-monitor",
  checkAdminAndMonitorRole,
  getAdminAndCurrentMonitor
);
router.post("/:id/set-monitor", checkAdminRole, setClassMonitor);
router.get("/:id/delete", checkAdminRole, deleteClassData);
router.post("/:id/edit", checkAdminAndMonitorRole, editClassData);
router.post("/:id/add-lesson", checkAdminAndMonitorRole, addLesson);
router.get("/:id/get-lessons", auth, getListLessonByClass);
router.get("/:id/get-students", auth, getStudentWithAchievementByClass);
// router.get("/:id/get-pairs", checkAdminAndMonitorRole, getPairTeaching);
router.post("/:id/pairs/new", checkAdminAndMonitorRole, newPairTeaching);
router.post("/:id/pairs/:pairId/set-volunteer", checkAdminAndMonitorRole, setPairVolunteer);
router.get("/:id/lessons/:lessonId", auth, getLessonData);
router.get("/:id/lessons/:lessonId/delete", auth, deleteLessonData);
router.post("/:id/lessons/:lessonId/edit", auth, editLessonData);
router.post("/:id/lessons/:lessonId/assign", auth, assignLesson);
router.post("/:id/lessons/:lessonId/unassign", auth, unassignLesson);

module.exports = router;
