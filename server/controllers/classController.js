const {
  VOLUNTEER_ROLE,
  ADMIN,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const {
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
  getAllClassesData,
  getClassByUser,
} = require("../repository/classRepository");
const { getLessonsByCLass } = require("../repository/lessonRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const getClasses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await getUserDataById(userId);
    const classes = await getClassByUser(user);
    if(classes) {
      Promise.all(classes.map((item) => tranformClassData(item))).then(
        (value) => {
          res.status(200).json({ success: true, classes: value });
        }
      );
    } else {
      res.status(200).json({ success: true, classes: {}, message: "No class" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

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
        currentVolunteer.role === ADMIN ||
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

module.exports = {
  addClass,
  getClasses,
  getClassData,
  deleteClassData,
  editClassData,
  getClassSchedule,
  getAllClasses,
};
