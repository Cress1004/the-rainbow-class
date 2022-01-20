const {
  STUDENT_ROLE,
  SUPER_ADMIN,
  ADMIN,
} = require("../defaultValues/constant");
const {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
  getStudentByClass,
} = require("../repository/studentRepository");
const { getUserDataById, checkDuplicateMail } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");
const { activeAccount } = require("./authController");

const addNewStudent = async (req, res) => {
  try {
    const studentData = req.body.studentData;
    if(await checkDuplicateMail(studentData.email)) {
      res.status(200).json({ success: false, message: "Duplicate Email!" });
    } else {
      await storeStudent(studentData);
      await activeAccount(studentData.email);
      res.status(200).json({ success: true });      
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudents = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await getUserDataById(userId);
    let students;
    if (user.role === STUDENT_ROLE) {
      const currentStudent = await getStudentByUserId(userId);
      students = await getStudentByClass(currentStudent.class);
    } else {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if (currentVolunteer.role === SUPER_ADMIN) {
        students = null;
      } else if (currentVolunteer.role === ADMIN) {
        students = await getListStudents();
      } else {
        students = await getStudentByClass(currentVolunteer.class);
      }
    }
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
};

const deleteStudentData = async (req, res) => {
  try {
    await deleteStudent(req.body.studentId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addNewStudent,
  getStudents,
  getStudentInfo,
  editStudent,
  deleteStudentData,
};
