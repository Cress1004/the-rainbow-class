const { Address } = require("../models/Address");
const { Grade } = require("../models/Grade");
const { Location } = require("../models/Location");
const { Semester } = require("../models/Semester");
const { StudentType } = require("../models/StudentType");
const { Subject } = require("../models/Subject");
const { findAll } = require("../services");

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
  return StudentType.find({ deleted: false });
};

const findStudentTypeWithParams = async (params) => {
  try {
    return await findAll(StudentType, ["title"], {
      limit: parseInt(params.limit),
      offset: (params.offset - 1) * 10,
      search: params.search,
      query: { deleted: false },
      sort: ["created_at_dsc"],
    });
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const getStudentTypeById = (id) => {
  return StudentType.findOne({ _id: id });
};

const storeStudentType = (data) => {
  const studentType = new StudentType(data);
  return studentType.save();
};

const updateStudentType = async (data) => {
  try {
    return await StudentType.findOneAndUpdate(
      { _id: data.id },
      { title: data.title },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const removeStudentType = async (id) => {
  try {
    return await StudentType.findOneAndUpdate(
      { _id: data.id },
      { deleted: true },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const findAllSubjects = () => {
  try {
    return Subject.find({ deleted: false });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findSubjectWithParams = async (params) => {
  try {
    return await findAll(Subject, ["title"], {
      limit: parseInt(params.limit),
      offset: (params.offset - 1) * 10,
      search: params.search,
      query: { deleted: false },
      sort: ["created_at_dsc"],
    });
  } catch (error) {
    console.log(error);
    return { message: error };
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

const updateSubject = async (data) => {
  try {
    return await Subject.findOneAndUpdate(
      { _id: data.id },
      { title: data.title },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const removeSubject = async (id) => {
  try {
    return await Subject.findOneAndUpdate(
      { _id: id },
      { deleted: true },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findGrades = () => {
  try {
    return Grade.find({ deleted: false });
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
    return await Grade.findOneAndUpdate(
      { _id: id },
      { deleted: true },
      {
        new: true,
        upsert: true,
      }
    );  } catch (error) {
    console.log(error);
    return null;
  }
};

const findSemesters = () => {
  try {
    return Semester.find({ deleted: false });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const storeSemester = (data) => {
  try {
    const semester = new Semester(data);
    return semester.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const removeSemester = async (id) => {
  try {
    return await Semester.findOneAndUpdate(
      { _id: id },
      { deleted: true },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findGragesWithParams = async (params) => {
  try {
    return await findAll(Grade, ["title"], {
      limit: parseInt(params.limit),
      offset: (params.offset - 1) * 10,
      search: params.search,
      query: { deleted: false },
      sort: ["created_at_dsc"],
    });
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const updateGrade = async (data) => {
  try {
    return await Grade.findOneAndUpdate(
      { _id: data.id },
      { title: data.title },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const findSemestersWithParams = async (params) => {
  try {
    return await findAll(Semester, ["title", "startDate", "endDate"], {
      limit: parseInt(params.limit),
      offset: (params.offset - 1) * 10,
      search: params.search,
      query: { deleted: false },
      sort: ["created_at_dsc"],
    });
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const updateSemester = async (data) => {
  try {
    return await Semester.findOneAndUpdate(
      { _id: data.id },
      { title: data.title, startDate: data.startDate, endDate: data.endDate },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

module.exports = {
  findAllLocation,
  findAllStudentTypes,
  getStudentTypeById,
  storeStudentType,
  updateStudentType,
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
  findStudentTypeWithParams,
  findSubjectWithParams,
  updateSubject,
  findGragesWithParams,
  updateGrade,
  findSemestersWithParams,
  updateSemester,
};
