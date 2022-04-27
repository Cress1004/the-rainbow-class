const { saveNewReport } = require("../repository/reportRepository");

const newReport = async (req, res) => {
  try {
    await saveNewReport(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  newReport,
};
