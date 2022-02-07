const { updatePersonInCharge } = require("../repository/scheduleRepository");

const updatePersonInChargeToSchedule = async (req, res) => {
  try {
    const data = req.body.values;
    await updatePersonInCharge(data.scheduleId, data.personInChargeId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  updatePersonInChargeToSchedule,
};
