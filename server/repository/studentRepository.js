const { STUDENT_ROLE } = require("../defaultValues/constant");
const { Student } = require("../models/Student");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");

const storeStudent = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      role: STUDENT_ROLE,
    });
    const newStudent = await new Student({
      parentName: data.parentName,
      studentTypes: data.studentTypes,
      user: newUser._id,
      class: data.class,
    });
    return newStudent.save();
  } catch (error) {
    console.log("fail to store new student");
  }
};

const getStudentById = async (id) => {
  try {
    return await Student.findOne({ _id: id })
      .populate({ path: "studentTypes" })
      .populate({ path: "class", select: "name" })
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address",
        populate: { path: "address", select: "address description" },
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
      .populate("user", "name phoneNumber")
      .populate("class", "name")
      .populate("studentTypes");
  } catch (error) {
    console.log("fail to get list students");
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
    };
    await updateUserData(userData);
    student.parentName = data.parentName;
    student.studentTypes = data.studentTypes;
    return student.save();
  } catch (error) {
    console.log("fail to update student");
  }
};

const deleteStudent = async (id) => {
  const student = await Student.findOne({ _id: id });
  await deleteUser(student.user._id);
  return await Student.deleteOne({ _id: id });
};

const getStudentByClass = async (classId) => {
  try {
    return await Student.find({ class: classId })
      .populate("user", "name phoneNumber")
      .populate("class", "name")
      .populate("studentTypes");
  } catch (error) {
    console.log("fail to get student by class");
    return null;
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
};
