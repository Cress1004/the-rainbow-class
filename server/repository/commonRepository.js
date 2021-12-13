const { Address } = require("../models/Address");
const { Location } = require("../models/Location");
const { StudentType } = require("../models/StudentType");

const findAllLocation = () => {
  return Location.find({});
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
    console.log("update address fail");
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
};
