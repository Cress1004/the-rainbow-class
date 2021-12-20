const {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
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

const getStudentInfo = async (req, res) => {
  try {
    const studentData = await getStudentById(req.body.studentId);
    res.status(200).json({ success: true, studentData: studentData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editStudent = async (req, res) => {
    try {
        await updateStudent(req.body.studentData);
        console.log(req.body.studentData)
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).send(error);
      }
}

module.exports = {
  addNewStudent,
  getStudents,
  getStudentInfo,
  editStudent
};
