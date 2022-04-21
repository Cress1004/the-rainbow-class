const { STUDENT_ROLE } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
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
    const userId = req.user._id;
    const classId = req.params.id;
    const currentUser = await getUserDataById(userId);
    let flag = await checkCurrentUserBelongToClass(currentUser, classId);
    if (flag) {
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
    const userId = req.user._id;
    const lessonId = req.params.lessonId;
    const currentUser = await getUserDataById(userId);
    const lessonData = await findLesson(lessonId);
    let flag = await checkCurrentUserBelongToClass(
      currentUser,
      lessonData.class
    );
    if (flag) {
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
    await deleteLesson(req.params.lessonId);
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
    await addPaticipant(req.body.scheduleId, req.user._id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const unassignLesson = async (req, res) => {
  try {
    await removePaticipant(req.body.scheduleId, req.user._id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const checkCurrentUserBelongToClass = async (currentUser, classId) => {
  if (currentUser.role === STUDENT_ROLE) {
    return compareObjectId(currentUser.class._id, classId);
  } else {
    const currentVolunteer = await getVolunteerByUserId(currentUser._id);
    if (currentVolunteer.isAdmin) return true;
    else {
      return compareObjectId(currentUser.class._id, classId);
    }
  }
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
