const { getLessonBySchedule } = require("../repository/lessonRepository");
const { getAllSchedules } = require("../repository/scheduleRepository");

const getMySchedule = async (req, res) => {
  try {
    const schedules = await getAllSchedules(req.body.userId);
    Promise.all(
      schedules.map((schedule) => getLessonBySchedule(schedule._id))
    ).then((result) => {
      res.status(200).json({ success: true, schedule: result });
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getMySchedule,
};
