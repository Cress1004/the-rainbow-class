const {
  storeStudent,
  getListStudents,
} = require("../repository/studentRepository");

const addNewStudent = async (req, res) => {
  try {
    await storeStudent(req.body.studentData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudents = async (req, res) => {
  try {
      const students = await getListStudents();
    res.status(200).json({ success: true, students: students });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addNewStudent,
  getStudents,
};
