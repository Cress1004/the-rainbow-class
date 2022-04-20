const {
  VOLUNTEER_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const {
  checkCurrentUserBelongToCurrentClass,
} = require("../function/commonFunction");
const {
  getAchievementByStudentId,
} = require("../repository/achievementRepository");
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
const { getInterviewSchedule } = require("../repository/cvRepository");
const { getLessonsByCLass } = require("../repository/lessonRepository");
const {
  getPairTeachingByClass, storeNewPairTeachingWithStudent, setVolunteer,
} = require("../repository/pairTeachingRepository");
const { getStudentByClass } = require("../repository/studentRepository");
const { getUserDataById } = require("../repository/userRepository");
const {
  getVolunteerByUserId,
  getCurrentClassMonitorAndAdmin,
} = require("../repository/volunteerRepository");

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
    const currentUser = req.currentUser;
    if (currentUser.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(currentUser._id);
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
    const classData = await findClassById(req.params.id);
    res
      .status(200)
      .json({ success: true, classData: await tranformClassData(classData) });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteClassData = async (req, res) => {
  try {
    await deleteClass(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getClassSchedule = async (req, res) => {
  try {
    const classId = req.body.classId;
    const scheduleLesson = await getLessonsByCLass(classId);
    const scheduleInterview = await getInterviewSchedule(classId);
    const classData = await findClassById(classId);
    res.status(200).json({
      success: true,
      schedule: [...scheduleLesson, ...scheduleInterview],
      classData: classData,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const setClassMonitor = async (req, res) => {
  try {
    const data = req.body.value;
    await setMonitor(data.classId, data.classMonitor, data.subClassMonitor);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudentWithAchievementByClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await findClassById(classId);
    const studentList = await getStudentByClass(classData);
    Promise.all(
      studentList.map((item) => getAchievementByStudentId(item))
    ).then((value) => {
      res.status(200).json({ success: true, studentData: value });
    });
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

const getAdminAndCurrentMonitor = async (req, res) => {
  try {
    const classId = req.params.id;
    const currentUser = req.currentUser;
    const currentVolunteer = req.currentVolunteer;
    const currentClass = await findClassById(classId);
    if (
      checkCurrentUserBelongToCurrentClass(
        currentUser,
        currentVolunteer,
        currentClass
      )
    ) {
      const data = await getCurrentClassMonitorAndAdmin(classId);
      res.status(200).json({ success: true, data: data });
    } else {
      res.status(200).json({ success: fasle, message: "Permission denied!" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// const getPairTeaching = async (req, res) => {
//   try {
//     const classId = req.params.id;
//     const currentUser = req.currentUser;
//     const currentVolunteer = req.currentVolunteer;
//     const currentClass = await findClassById(classId);
//     if (
//       checkCurrentUserBelongToCurrentClass(
//         currentUser,
//         currentVolunteer,
//         currentClass
//       )
//     ) {
//       const data = await getPairTeachingByClass(currentClass);
//       res.status(200).json({ success: true, pairsData: data });
//     } else {
//       res.status(200).json({ success: fasle, message: "Permission denied!" });
//     }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

const newPairTeaching = async (req, res) => {
  try {
    const data = req.body;
    await storeNewPairTeachingWithStudent(data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const setPairVolunteer = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await setVolunteer(data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
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
  // getPairTeaching,
  newPairTeaching,
  setPairVolunteer
};
