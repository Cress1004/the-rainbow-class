const { STUDENT_ROLE, SUPER_ADMIN } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentDescription,
  updateStudentStatus,
} = require("../repository/studentRepository");
const {
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
    const user = req.user;
    const allStudents = await getListStudents();
    let students;
    if (user.role === STUDENT_ROLE) {
      students = allStudents.filter((item) =>
        compareObjectId(item.user.class._id, user.class)
      );
    } else {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.role === SUPER_ADMIN) {
        students = null;
      } else if (currentVolunteer.isAdmin) {
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
    const studentData = await getStudentById(req.params.id);
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

const changeStudentStatus = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const updateData = req.body.dataToSend;
    await updateStudentStatus(currentUser, updateData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};


const deleteStudentData = async (req, res) => {
  try {
    await deleteStudent(req.params.id);
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
  updateStudentOverview,
  changeStudentStatus
};
