const { Address } = require("../models/Address");
const { Grade } = require("../models/Grade");
const { Location } = require("../models/Location");
const { Semester } = require("../models/Semester");
const { StudentType } = require("../models/StudentType");
const { Subject } = require("../models/Subject");

const findAllLocation = () => {
  return Location.find({});
};

const getDistrictsByProvinceId = async (provinceId) => {
  const province = await Location.findOne({ id: provinceId });
  return province?.districts;
};

const getWardsByDistrictId = async (provinceId, districtId) => {
  const province = await Location.findOne({ id: provinceId });
  const district = province?.districts.find((item) => item.id === districtId);
  return district?.wards;
};

const storeAddress = (data) => {
  const newAddress = new Address(data);
  newAddress.save();
  return newAddress;
};

const updateAddress = async (id, data) => {
  try {
    const address = await Address.findOne({ _id: id });
    address.address = data.address;
    address.description = data.description;
    await address.save();
  } catch (error) {
    console.log("update address fail");
  }
};

const deleteAddress = async (id) => {
  try {
    return Address.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log("delete address fail");
  }
};

const findAllStudentTypes = () => {
  return StudentType.find({});
};

const getStudentTypeById = (id) => {
  return StudentType.findOne({ _id: id });
};

const storeStudentType = (data) => {
  const studentType = new StudentType(data);
  return studentType.save();
};

const removeStudentType = async (id) => {
  try {
    return StudentType.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log("delete student type fail");
  }
};

const findAllSubjects = () => {
  try {
    return Subject.find({});
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getSubjectById = (id) => {
  try {
    return Subject.findOne({ _id: id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const storeSubject = (data) => {
  try {
    const subject = new Subject(data);
    return subject.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeSubject = async (id) => {
  try {
    return Subject.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findGrades = () => {
  try {
    return Grade.find({});
  } catch (error) {
    console.log(error);
    return null;
  }
};

const storeGrade = (data) => {
  try {
    const grade = new Grade(data);
    return grade.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeGrade = async (id) => {
  try {
    return Grade.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findSemesters = () => {
  try {
    return Semester.find({});
  } catch (error) {
    console.log(error);
    return null;
  }
};

const storeSemester = (data) => {
  try {
    const grade = new Semester(data);
    return grade.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeSemester = async (id) => {
  try {
    return Semester.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  findAllLocation,
  findAllStudentTypes,
  getStudentTypeById,
  storeStudentType,
  storeAddress,
  updateAddress,
  removeStudentType,
  deleteAddress,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
  findAllSubjects,
  getSubjectById,
  storeSubject,
  removeSubject,
  findGrades,
  storeGrade,
  removeGrade,
  findSemesters,
  storeSemester,
  removeSemester,
};
