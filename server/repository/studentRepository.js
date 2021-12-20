const { Student } = require("../models/Student");
const { storeUser, updateUserData, deleteUser } = require("./userRepository");
const { storeAddress, updateAddress } = require("./commonRepository");

const storeStudent = async (data) => {
  try {
    const newUser = await storeUser({
      name: data.name,
      email: data.email,
    });
    const newStudent = await new Student({
      phone_number: data.phone_number,
      parent_name: data.parent_name,
      student_types: data.student_types,
      user: newUser._id,
    });
    storeAddress(data.address);
    return newStudent.save();
  } catch (error) {
    console.log("fail to store new student");
  }
};

const getStudentById = async (id) => {
  try {
    return await Student.findOne({ _id: id })
      .populate("user", "name email phone_number gender image")
      .populate("class", "class_name")
      .populate("address");
  } catch (error) {
    console.log("fail to get student data");
  }
};

const getListStudents = async () => {
  try {
    return Student.find({})
      .populate("user", "name phone_number")
      .populate("class", "class_name")
      .populate("student_types");
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
      gender: data.gender,
    };
    await updateUserData(userData);
    if (student.address) {
      await updateAddress(student.address, data.address);
    } else {
      const address = await storeAddress(data.address);
      student.address = address._id;
    }
    console.log(data.phoneNumber);
    student.phone_number = data.phoneNumber;
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

module.exports = {
  storeStudent,
  getListStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
