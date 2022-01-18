const {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../repository/studentRepository");
const { activeAccount } = require("./authController");

const addNewStudent = async (req, res) => {
  try {
    const studentData = req.body.studentData 
    await storeStudent(studentData);
    await activeAccount(studentData.email);
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
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).send(error);
      }
}

const deleteStudentData = async (req, res) => {
    try {
        await deleteStudent(req.body.studentId);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
  addNewStudent,
  getStudents,
  getStudentInfo,
  editStudent,
  deleteStudentData
};
