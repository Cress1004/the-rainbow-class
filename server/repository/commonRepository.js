const { Address } = require("../models/Address");
const { Location } = require("../models/Location");
const { StudentType } = require("../models/StudentType");

const findAllLocation = () => {
  return Location.find({});
};

const getDistrictsByProvinceId = async (provinceId) => {
  const province = await Location.findOne({ id: provinceId });
  return province.districts;
};

const getWardsByDistrictId = async (provinceId, districtId) => {
  const province = await Location.findOne({ id: provinceId });
  const district = province.districts.find((item) => item.id === districtId);
  return district.wards;
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
};
