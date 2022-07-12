const { getLessonBySchedule } = require("../repository/lessonRepository");
const { createNotiInchargeLesson } = require("../repository/notificationRepository");
const { updatePersonInCharge } = require("../repository/scheduleRepository");

const updatePersonInChargeToSchedule = async (req, res) => {
  try {
    const data = req.body.values;
    await updatePersonInCharge(data.scheduleId, data.personInChargeId);
    const lessonData = await getLessonBySchedule(data.scheduleId);
    await createNotiInchargeLesson(data.personInChargeId, lessonData)
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  updatePersonInChargeToSchedule,
};
