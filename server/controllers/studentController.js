const {
  STUDENT_ROLE,
  SUPER_ADMIN,
  ADMIN,
} = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentDescription,
} = require("../repository/studentRepository");
const {
  getUserDataById,
  checkDuplicateMail,
} = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");
const { activeAccount } = require("./authController");

const addNewStudent = async (req, res) => {
  try {
    const studentData = req.body.studentData;
    if (await checkDuplicateMail(studentData.email)) {
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
    const allStudents = await getListStudents();
    let students;
    if (user.role === STUDENT_ROLE) {
      students = allStudents.filter((item) =>
        compareObjectId(item.user.class._id, user.class)
      );
    } else {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if (currentVolunteer.role === SUPER_ADMIN) {
        students = null;
      } else if (currentVolunteer.role === ADMIN) {
        students = allStudents;
      } else {
        students = allStudents.filter((item) =>
          compareObjectId(item.user.class._id, user.class)
        );
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
    const studentData = req.body.studentData;
    const flag = await updateStudent(studentData);
    if (flag && !flag.message) {
      res.status(200).json({ success: true });
    } else if (flag.message) {
      res.status(200).json({ success: false, message: flag.message });
    } else
      res.status(200).json({ success: false, message: "something went wrong" });
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

const updateStudentOverview = async (req, res) => {
  try {
    await updateStudentDescription(req.body.values);
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
  updateStudentOverview
};
