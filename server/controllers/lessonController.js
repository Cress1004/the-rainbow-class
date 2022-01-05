const {
  storeNewLesson,
  getLessonsByCLass,
  findLesson,
  deleteLesson,
  editLesson,
} = require("../repository/lessonRepository");
const { removePaticipant, addPaticipant } = require("../repository/scheduleRepository");

const addLesson = async (req, res) => {
  try {
    await storeNewLesson(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getListLessonByClass = async (req, res) => {
  try {
    const lessons = await getLessonsByCLass(req.body.classId);
    res.status(200).json({ success: true, lessons: lessons });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getLessonData = async (req, res) => {
  try {
    const lessonData = await findLesson(req.body.lessonId);
    res.status(200).json({ success: true, lessonData: lessonData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteLessonData = async (req, res) => {
  try {
    await deleteLesson(req.body.lessonId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editLessonData = async (req, res) => {
  try {
    await editLesson(req.body.lessonData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const assignLesson = async (req, res) => {
  try {
    await addPaticipant(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const unassignLesson = async (req, res) => {
  try {
    await removePaticipant(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addLesson,
  getListLessonByClass,
  getLessonData,
  deleteLessonData,
  editLessonData,
  assignLesson,
  unassignLesson
};
