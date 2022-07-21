const { checkRetirement } = require("../function/commonFunction");
const {
  getAchievementByAllStudentsAndMonth,
} = require("../repository/achievementRepository");
const {
  storeStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentDescription,
  updateStudentStatus,
  getStudentByClassId,
  getListStudentsWithParams,
  getAllStudents,
} = require("../repository/studentRepository");
const { checkDuplicateMail } = require("../repository/userRepository");
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
    const params = req.query;
    const query = params.query ? JSON.parse(params.query) : {};
    const studentIds = await getAchievementByAllStudentsAndMonth(
      query.month,
      query.point,
      query.compareType
    );
    // if (
    //   query.achievementType === 0 &&
    //   query.compareType &&
    //   query.month &&
    //   query.point
    // ) {
    //   await getAchievementByAllStudentsAndMonth(
    //     query.month,
    //     query.point,
    //     query.compareType
    //   );
    // }
    const students = await getListStudentsWithParams(user, params, studentIds);
    res.status(200).json({
      success: true,
      students: students.documents,
      numberOfStudent: students.count,
    });
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

const getStudentsDataByFilter = async (req, res) => {
  try {
    const filterData = req.body;
    const studentByClass = await getStudentByClassId(filterData.class);
    const studentByTypes = studentByClass.filter((item) => {
      const studentTypeArray = item.studentTypes.map((i) => i._id);
      return filterData.studentType.every((ai) =>
        studentTypeArray.includes(ai)
      );
    });
    const students = studentByTypes;
    res.status(200).json({ success: true, students: students });
  } catch (error) {
    res.status(400).send(error);
  }
};

const studentCount = async (req, res) => {
  try {
    const allStudents = await getAllStudents();
    const studentCountData = {
      numberOfStudent: allStudents.length,
      studyingStudent: allStudents.filter((item) => !item.retirementDate)
        .length,
      retiredStudent: allStudents.filter(
        (item) => item.retirementDate && checkRetirement(item.retirementDate)
      ).length,
    };
    res.status(200).json({ success: true, studentCountData: studentCountData });
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
  changeStudentStatus,
  getStudentsDataByFilter,
  studentCount,
};
