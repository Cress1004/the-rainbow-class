const { getClassScheduleByUserId, getClassByUserId } = require("../repository/classRepository");
const { getLessonBySchedule } = require("../repository/lessonRepository");
const { getAllSchedulesByVolunteer } = require("../repository/scheduleRepository");

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

module.exports = {
  getMySchedule,
  getMyClasschedule
};
