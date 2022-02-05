const { VOLUNTEER_ROLE, STUDENT_ROLE } = require("../defaultValues/constant");
const {
  getClassScheduleByUserId,
  getClassByUser,
} = require("../repository/classRepository");
const {
  getLessonBySchedule,
  getLessonsByCLass,
} = require("../repository/lessonRepository");
const {
  getAllSchedulesByVolunteer,
} = require("../repository/scheduleRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const getMySchedule = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await getUserDataById(userId);
    if (user.role === VOLUNTEER_ROLE) {
      const schedules = await getAllSchedulesByVolunteer(req.body.userId);
      Promise.all(
        schedules.map((schedule) => getLessonBySchedule(schedule._id))
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
    const userId = req.body.userId;
    const user = await getUserDataById(userId);
    const schedule = await getClassScheduleByUserId(userId);
    const classData = await getClassByUser(user);
    res
      .status(200)
      .json({ success: true, schedule: schedule, classData: classData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getRole = async (req, res) => {
  try {
    const user = await getUserDataById(req.body.userId);
    const classData = await getClassByUser(user);
    var userRole = {};
    userRole.role = user.role;
    if (userRole.role === VOLUNTEER_ROLE) {
      const volunteer = await getVolunteerByUserId(user._id);
      userRole.subRole = volunteer.role;
    }
    res
      .status(200)
      .json({ success: true, userRole: userRole, classId: classData });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getMySchedule,
  getMyClasschedule,
  getRole,
};
