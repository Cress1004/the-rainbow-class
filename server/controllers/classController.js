const {
  VOLUNTEER_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { getAchievementByStudentId } = require("../repository/achievementRepository");
const {
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
  getAllClassesData,
  getClassByUser,
  setMonitor,
  listClassWithName,
} = require("../repository/classRepository");
const { getLessonsByCLass } = require("../repository/lessonRepository");
const { getStudentByClass } = require("../repository/studentRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const getAllClasses = async (req, res) => {
  try {
    const classes = await getAllClassesData();
    Promise.all(classes.map((item) => tranformClassData(item))).then(
      (value) => {
        res.status(200).json({ success: true, classes: value });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

const addClass = async (req, res) => {
  try {
    storeClass(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editClassData = async (req, res) => {
  try {
    const data = req.body;
    const currentUser = await getUserDataById(data.userId);
    if (currentUser.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(data.userId);
      const userClass = await getClassByUser(currentUser);
      if (
        currentVolunteer.isAdmin ||
        ((currentVolunteer.role === CLASS_MONITOR ||
          currentVolunteer.role === SUB_CLASS_MONITOR) &&
          userClass._id === data.classData.id)
      ) {
        await editClass(data.classData);
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, message: "Permission Denied" });
      }
    } else {
      res.status(200).json({ success: false, message: "Permission Denied" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getClassData = async (req, res) => {
  try {
    const classData = await findClassById(req.body.classId);
    res
      .status(200)
      .json({ success: true, classData: await tranformClassData(classData) });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteClassData = async (req, res) => {
  try {
    await deleteClass(req.body.classId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getClassSchedule = async (req, res) => {
  try {
    const classId = req.body.classId;
    const schedule = await getLessonsByCLass(classId);
    const classData = await findClassById(classId);
    res
      .status(200)
      .json({ success: true, schedule: schedule, classData: classData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const setClassMonitor = async (req, res) => {
  try {
    const data = req.body.values;
    await setMonitor(data.classId, data.classMonitor, data.subClassMonitor);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudentWithAchievementByClass = async (req, res) => {
  try {
    const classId = req.body.classId;
    const classData = await findClassById(classId);
    const studentList = await getStudentByClass(classData);
    Promise.all(studentList.map((item) => getAchievementByStudentId(item))).then(
      (value) => {
        res.status(200).json({ success: true, studentData: value });
      }
    );
    // res.status(200).json({ success: true, studentData: studentList });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getListClassWithName = async (req, res) => {
  try {
    const classes = await listClassWithName();
    res.status(200).json({ success: true, classes: classes });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addClass,
  getClassData,
  deleteClassData,
  editClassData,
  getClassSchedule,
  getAllClasses,
  setClassMonitor,
  getStudentWithAchievementByClass,
  getListClassWithName
};
