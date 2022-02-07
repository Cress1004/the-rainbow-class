const { STUDENT_ROLE } = require("../defaultValues/constant");
const { compareObjectId } = require("../function/commonFunction");
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
      class: data.class,
    });
    const newStudent = await new Student({
      parentName: data.parentName,
      studentTypes: data.studentTypes,
      user: newUser._id,
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
      .populate({
        path: "user",
        select: "name email phoneNumber gender image address class",
        populate: [
          { path: "address", select: "address description" },
          { path: "class", select: "name" },
        ],
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
        select: "name phoneNumber class",
        populate: { path: "class", select: "name" },
      })
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

const deleteStudent = async (id) => {
  const student = await Student.findOne({ _id: id });
  await deleteUser(student.user._id);
  return await Student.deleteOne({ _id: id });
};

const getStudentByClass = async (className) => {
  try {
    const allStudents = await Student.find({}).populate({
      path: "user",
      select: "name class",
    });
    return allStudents.filter((item) =>
      compareObjectId(item.user.class._id, className._id)
    );
  } catch (error) {
    console.log("fail to get student by class");
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

module.exports = {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
  getStudentByClass,
  updateStudentDescription,
};
