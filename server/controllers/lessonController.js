const { STUDENT_ROLE } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const {
  storeNewLesson,
  getLessonsByCLass,
  findLesson,
  deleteLesson,
  editLesson,
  getLessonByClassAndMonth,
  getReportByLesson,
} = require("../repository/lessonRepository");
const {
  getReportsByClass,
  getReportByStudent,
} = require("../repository/reportRepository");
const {
  removeParticipant,
  addParticipant,
} = require("../repository/scheduleRepository");
const { getStudentByClassId } = require("../repository/studentRepository");
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
    await addParticipant(req.body.scheduleId, req.user._id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const unassignLesson = async (req, res) => {
  try {
    await removeParticipant(req.body.scheduleId, req.user._id);
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

const getLessonsAndAchievementByClassAndMonth = async (req, res) => {
  try {
    const lessons = await getLessonByClassAndMonth(
      req.body.classId,
      req.body.month
    );
    const reports = await getReportsByClass(req.body.classId, req.body.month);
    if (lessons.length) {
      Promise.all(lessons.map((item) => getReportByLesson(reports, item))).then(
        (value) => {
          res.status(200).json({ success: true, lessonsWithReport: value });
        }
      );
      return;
    }
    res.status(200).json({ success: true, lessonsWithReport: [] });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getAllReportBySemester = async (classId, monthRange) => {
  let allReports = [];
  let allLessons = [];
  for (let index = 0; index < monthRange?.length; index++) {
    allLessons.push({
      month: monthRange[index],
      lessons: await getLessonByClassAndMonth(classId, monthRange[index]),
    });
    allReports = allReports.concat(await getReportsByClass(classId, monthRange[index]));
  }
  return { allReports, allLessons };
};

const getLessonsAndAchievementByClassAndSemester = async (req, res) => {
  try {
    const monthRange = req.body.monthRange;
    const classId = req.body.classId;
    const allReportsBySem = await getAllReportBySemester(classId, monthRange);
    let allLessons = allReportsBySem.allLessons;
    let allReports = allReportsBySem.allReports;
    let lessonsWithReports = [];
    let allAchievement = [];
    for (let index = 0; index < allLessons.length; index++) {
      for (let i = 0; i < allLessons[index].lessons.length; i++) {
        const currentLesson = allLessons[index].lessons[i];
        lessonsWithReports.push({
          month: allLessons[index].month,
          lesson: currentLesson,
          report: await getReportByLesson(allReports, currentLesson),
        });
      }
    }
    const studentList = await getStudentByClassId(classId);
    for (let index = 0; index < studentList.length; index++) {
      allAchievement.push(
        await getReportByStudent(allReports, studentList[index])
      );
    }
    res
      .status(200)
      .json({
        success: true,
        lessonsWithReport: lessonsWithReports,
        allAchievement: allAchievement,
      });
  } catch (error) {
    console.log(error);
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
  unassignLesson,
  getLessonsAndAchievementByClassAndMonth,
  getLessonsAndAchievementByClassAndSemester,
};
