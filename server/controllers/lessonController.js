const { STUDENT_ROLE, ADMIN } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const { getClassByUser } = require("../repository/classRepository");
const {
  storeNewLesson,
  getLessonsByCLass,
  findLesson,
  deleteLesson,
  editLesson,
} = require("../repository/lessonRepository");
const {
  removePaticipant,
  addPaticipant,
} = require("../repository/scheduleRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

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
    const userId = req.body.userId;
    const classId = req.body.classId;
    const currentUser = await getUserDataById(userId);
    let flag = await checkCurrentUserBelongToClass(currentUser, classId);
    if(flag) {
      const lessons = await getLessonsByCLass(classId);
      res.status(200).json({ success: true, lessons: lessons });  
    } else {
      res.status(200).json({ success: false, message: "Permission denied" }); 
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getLessonData = async (req, res) => {
  try {
    const userId = req.body.userId;
    const lessonId = req.body.lessonId;
    const currentUser = await getUserDataById(userId);
    const lessonData = await findLesson(lessonId);
    let flag = await checkCurrentUserBelongToClass(currentUser, lessonData.class);
    if(flag) {
      res.status(200).json({ success: true, lessonData: lessonData });
    } else {
      res.status(200).json({ success: false, message: "Permission denied" }); 
    }
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

const checkCurrentUserBelongToClass = async (currentUser, classId) => {
  return compareObjectId(currentUser.class._id, classId)
};

module.exports = {
  addLesson,
  getListLessonByClass,
  getLessonData,
  deleteLessonData,
  editLessonData,
  assignLesson,
  unassignLesson,
};
