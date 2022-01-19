const { VOLUNTEER_ROLE, ADMIN } = require("../defaultValues/constant");
const {
  findAllClasses,
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
  findClassbyVolunteer,
} = require("../repository/classRepository");
const { getLessonsByCLass } = require("../repository/lessonRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const getClasses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await getUserDataById(userId);
    if(user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if(currentVolunteer.role === ADMIN) {
        const classes = await findAllClasses(user);
        Promise.all(classes.map((item) => tranformClassData(item))).then(
          (value) => {
            res.status(200).json({ success: true, classes: value });
          }
        );    
      } else {
        const classes = await findClassbyVolunteer(currentVolunteer);
        Promise.all(classes.map((item) => tranformClassData(item))).then(
          (value) => {
            res.status(200).json({ success: true, classes: value });
          }
        );    
      }
    }
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
    await editClass(req.body);
    res.status(200).json({ success: true });
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
    res.status(200).json({ success: true, schedule: schedule, classData: classData });
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
};
