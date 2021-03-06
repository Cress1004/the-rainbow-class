const {
  VOLUNTEER_ROLE,
  STUDENT_ROLE,
  LESSON_SCHEDULE,
  INTERVIEW_SCHEDULE,
} = require("../defaultValues/constant");
const {
  getClassByUser,
  getClassNameByUser,
} = require("../repository/classRepository");
const {
  getCVBySchedule,
  getInterviewScheduleByClassAndMonth,
} = require("../repository/cvRepository");
const {
  getLessonBySchedule,
  getLessonsByCLass,
  getLessonByClassAndMonth,
} = require("../repository/lessonRepository");
const {
  getAllSchedulesByVolunteer,
} = require("../repository/scheduleRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const getMySchedule = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === VOLUNTEER_ROLE) {
      const schedules = await getAllSchedulesByVolunteer(user._id);
      Promise.all(
        schedules.map((schedule) => {
          if (schedule.scheduleType === LESSON_SCHEDULE)
            return getLessonBySchedule(schedule._id);
          else if (schedule.scheduleType === INTERVIEW_SCHEDULE)
            return getCVBySchedule(schedule._id);
        })
      ).then((result) => {
        res.status(200).json({ success: true, schedule: result });
      });
    }
    if (user.role === STUDENT_ROLE) {
      const className = getClassByUser(user);
      const schedule = await getLessonsByCLass(className._id);
      res.status(200).json({ success: true, schedule: schedule });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMyClasschedule = async (req, res) => {
  try {
    const user = req.user;
    const monthRange = req.body.monthRange;
    let scheduleLesson = [];
    let scheduleInterview = [];
    for (let index = 0; index < monthRange.length; index++) {
      scheduleLesson = scheduleLesson.concat(
        await getLessonByClassAndMonth(user.class, monthRange[index])
      );
      scheduleInterview = scheduleInterview.concat(
        await getInterviewScheduleByClassAndMonth(user.class, monthRange[index])
      );
    }
    const classData = await getClassNameByUser(user);
    if (user.role === STUDENT_ROLE) {
      res.status(200).json({
        success: true,
        schedule: scheduleLesson,
        classData: classData,
      });
    } else {
      res.status(200).json({
        success: true,
        schedule: [...scheduleLesson, ...scheduleInterview],
        classData: classData,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    const classData = await getClassByUser(user);
    const userRole = await getCurrentUserRole(user);
    res
      .status(200)
      .json({ success: true, userRole: userRole, classId: classData._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCurrentUserRole = async (user) => {
  var userRole = {};
  userRole.role = user.role;
  if (userRole.role === VOLUNTEER_ROLE) {
    const volunteer = await getVolunteerByUserId(user._id);
    userRole.subRole = volunteer.role;
    userRole.isAdmin = volunteer.isAdmin;
  }
  return userRole;
};

module.exports = {
  getMySchedule,
  getMyClasschedule,
  getCurrentUser,
  getCurrentUserRole,
};
