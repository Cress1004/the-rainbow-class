const {
  saveNewReport,
  getReportsByPair,
  saveTeachByClassReports,
  getReportsByVolunteer,
  getReportsByClass,
  getReportByStudent,
} = require("../repository/reportRepository");
const { getStudentByClassId } = require("../repository/studentRepository");

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

const teachByClassNewReport = async (req, res) => {
  try {
    await saveTeachByClassReports(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getReportByVolunteerAndMonth = async (req, res) => {
  try {
    const reports = await getReportsByVolunteer(
      req.body.volunteerId,
      req.body.month
    );
    res.status(200).json({ success: true, reports: reports });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getReportByClassAndMonth = async (req, res) => {
  try {
    const reports = await getReportsByClass(req.body.classId, req.body.month);
    // res.status(200).json({ success: true, reports: reports });
    const studentList = await getStudentByClassId(req.body.classId);
    Promise.all(studentList.map((item) => getReportByStudent(reports, item))).then(
      (value) => {
        res.status(200).json({ success: true, studentData: value });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  newReport,
  getReportByPairAndMonth,
  teachByClassNewReport,
  getReportByVolunteerAndMonth,
  getReportByClassAndMonth,
};
