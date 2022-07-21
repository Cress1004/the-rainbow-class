const { STUDENT_ROLE, VOLUNTEER_ROLE } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
const { Achievement } = require("../models/Achievement");
const { Student } = require("../models/Student");
const {
  findAllWithUserPopulatedFields,
} = require("../services/queryByParamsServices");
const { storeNewPairTeachingWithStudent } = require("./pairTeachingRepository");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const { getVolunteerByUserId } = require("./volunteerRepository");

const RETIRED = 1;

const storeStudent = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      role: STUDENT_ROLE,
      class: data.class,
    });
    const newStudent = await new Student({
      parentName: data.parentName,
      studentTypes: data.studentTypes,
      birthday: data.birthday,
      admissionDay: data.admissionDay,
      user: newUser._id,
    });
    await storeNewPairTeachingWithStudent(newStudent._id, data.class);
    return newStudent.save();
  } catch (error) {
    console.log("fail to store new student");
  }
};

const getStudentById = async (id) => {
  try {
    return await Student.findOne({ _id: id })
      .populate({ path: "studentTypes" })
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address class",
        populate: [
          { path: "address", select: "address description" },
          { path: "class", select: "name" },
        ],
      })
      .populate({
        path: "updatedBy",
        select: "name",
      });
  } catch (error) {
    console.log("fail to get student data");
  }
};

const getStudentByUserId = async (userId) => {
  try {
    return await Student.findOne({ user: userId });
  } catch (error) {
    console.log("fail to get student data by user id");
    return error;
  }
};

const getListStudents = async () => {
  try {
    return Student.find({})
      .populate({
        path: "user",
        select: "name phoneNumber class isActive",
        populate: { path: "class", select: "name" },
      })
      .populate("studentTypes")
      .sort({ retirementDate: 1, created_at: -1 });
  } catch (error) {
    console.log("fail to get list students");
  }
};

const getStudentAchievementByMonth = async (studentId, month) => {
  try {
    const achievements = await Achievement.find({
      student: studentId,
    }).populate({
      path: "lesson",
      populate: { path: "schedule" },
    });
    return achievements.filter((item) => {
      const monthTime = item.lesson?.schedule.time.date.slice(0, 7);
      return monthTime == month;
    });
  } catch (error) {
    console.log(error);
  }
};

const getListStudentsWithParams = async (user, params, studentIds) => {
  try {
    const query = params.query ? JSON.parse(params.query) : {};
    if (user.role === STUDENT_ROLE) {
      return await findAllWithUserPopulatedFields(
        Student,
        ["name", "email", "phoneNumber"],
        user.class,
        {
          limit: parseInt(params.limit),
          offset: (params.offset - 1) * 10,
          query: {},
          search: params.search,
          sort: ["retirementDate_dsc", "created_at_asc"],
        }
      );
    }
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.isAdmin)
        return await findAllWithUserPopulatedFields(
          Student,
          ["name", "email", "phoneNumber"],
          null,
          {
            limit: parseInt(params.limit),
            offset: (params.offset - 1) * 10,
            query: query,
            search: params.search,
            sort: ["created_at_asc"],
          },
          studentIds
        );
      else {
        return await findAllWithUserPopulatedFields(
          Student,
          ["name", "email", "phoneNumber"],
          user.class,
          {
            limit: parseInt(params.limit),
            offset: (params.offset - 1) * 10,
            query: {},
            search: params.search,
            sort: ["created_at_asc"],
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const updateStudent = async (data) => {
  try {
    const student = await Student.findOne({ _id: data.id });
    const userData = {
      id: student.user._id,
      name: data.name,
      email: data.email,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      address: data.address,
      class: data.class,
    };
    const flag = await updateUserData(userData);
    if (flag && !flag.message) {
      student.parentName = data.parentName;
      student.studentTypes = data.studentTypes;
      return student.save();
    } else if (flag.message) {
      return { message: flag.message };
    } else {
      return null;
    }
  } catch (error) {
    console.log("fail to update student");
    return null;
  }
};

const updateStudentStatus = async (currentUser, updateData) => {
  try {
    const student = await Student.findOne({ _id: updateData.studentId });
    student.retirementDate = updateData.retirementDate;
    student.status = RETIRED;
    student.updatedBy = currentUser._id;
    return student.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteStudent = async (id) => {
  const student = await Student.findOne({ _id: id });
  await deleteUser(student.user._id);
  return await Student.deleteOne({ _id: id });
};

const getStudentByClass = async (className) => {
  try {
    const allStudents = await Student.find({})
      .populate({ path: "studentTypes" })
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address class",
        populate: [
          { path: "address", select: "address description" },
          { path: "class", select: "name" },
        ],
      })
      .populate({
        path: "updatedBy",
        select: "name",
      });
    return allStudents.filter((item) =>
      compareObjectId(item.user.class._id, className._id)
    );
  } catch (error) {
    console.log("fail to get student by class");
    return null;
  }
};

const getStudentByClassId = async (classId) => {
  try {
    const allStudents = await Student.find({})
      .populate({ path: "studentTypes" })
      .populate({
        path: "user",
        select: "name email phoneNumber class",
        populate: [{ path: "class", select: "name" }],
      });
    return allStudents.filter((item) =>
      compareObjectId(item.user.class._id, classId)
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateStudentDescription = async (data) => {
  try {
    const student = await Student.findOne({ _id: data.id });
    student.interest = data.interest;
    student.character = data.character;
    student.overview = data.overview;
    return student.save();
  } catch (error) {
    console.log("fail to update student description");
    return null;
  }
};

const getAllStudents = async () => {
  try {
    return await Student.find({ deleted: false }).populate("user");
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

module.exports = {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
  getStudentByClass,
  updateStudentDescription,
  updateStudentStatus,
  getStudentByClassId,
  getListStudentsWithParams,
  getStudentAchievementByMonth,
  getAllStudents,
};
