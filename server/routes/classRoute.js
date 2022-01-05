const express = require("express");
const {
  addClass,
  getClasses,
  getClassData,
  deleteClassData,
  editClassData,
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
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/add-class", auth, addClass);
router.post("/get-classes", auth, getClasses);
router.post("/:id", auth, getClassData);
router.post("/:id/delete", auth, deleteClassData);
router.post("/:id/edit", auth, editClassData);
router.post("/:id/add-lesson", auth, addLesson);
router.post("/:id/get-lessons", auth, getListLessonByClass);
router.post("/:id/lessons/:lessonId", auth, getLessonData);
router.post("/:id/lessons/:lessonId/delete", auth, deleteLessonData);
router.post("/:id/lessons/:lessonId/edit", auth, editLessonData);
router.post("/:id/lessons/:lessonId/assign", auth, assignLesson);
router.post("/:id/lessons/:lessonId/unassign", auth, unassignLesson);

module.exports = router;
