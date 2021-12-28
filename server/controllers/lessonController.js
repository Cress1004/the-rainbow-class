const { storeNewLesson, getLessonsByCLass } = require("../repository/lessonRepository");

const addLesson = async (req, res) => {
  try {
    const lesson = await storeNewLesson(req.body);
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

module.exports = {
  addLesson,
  getListLessonByClass
};
