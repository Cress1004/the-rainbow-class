const { saveNewReport, getReportsByPair } = require("../repository/reportRepository");

const newReport = async (req, res) => {
  try {
    await saveNewReport(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getReportByPairAndMonth = async (req, res) => {
  try {
    const reports = await getReportsByPair(req.body.pairId, req.body.month);
    res.status(200).json({ success: true, reports: reports });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  newReport,
  getReportByPairAndMonth,
};
