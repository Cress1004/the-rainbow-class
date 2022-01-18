const { VOLUNTEER_ROLE, STUDENT_ROLE } = require("../defaultValues/constant");
const { getClassScheduleByUserId, getClassByUserId } = require("../repository/classRepository");
const { getLessonBySchedule, getLessonsByCLass } = require("../repository/lessonRepository");
const { getAllSchedulesByVolunteer } = require("../repository/scheduleRepository");
const { getUserDataById } = require("../repository/userRepository");
const { getVolunteerById, getVolunteerByUserId } = require("../repository/volunteerRepository");

const getMySchedule = async (req, res) => {
  try {
    const schedules = await getAllSchedulesByVolunteer(req.body.userId);
    Promise.all(
      schedules.map((schedule) => getLessonBySchedule(schedule._id))
    ).then((result) => {
      res.status(200).json({ success: true, schedule: result });
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMyClasschedule = async (req, res) => {
  try {
    const schedule = await getClassScheduleByUserId(req.body.userId);
    const classData = await getClassByUserId(req.body.userId);
    res.status(200).json({ success: true, schedule:schedule, classData: classData });
  } catch (error) {
    res.status(400).send(error);
  }
}

const getRole = async (req, res) => {
  try {
    const user = await getUserDataById(req.body.userId);
    var userRole = {};
    userRole.role = user.role;
    if(userRole.role === VOLUNTEER_ROLE) {
      const volunteer = await getVolunteerByUserId(user._id);
      userRole.subRole = volunteer.role;  
    }
    res.status(200).json({ success: true, userRole: userRole });
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
  getMySchedule,
  getMyClasschedule,
  getRole
};
