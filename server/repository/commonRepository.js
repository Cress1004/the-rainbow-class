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
    // const address = await Address.findOneAndUpdate(
    //   { _id: _id},
    //   {
    //     $set: {
    //       address: data.address,
    //       address: {
    //         province: data.address.province,
    //         district: data.address.district,
    //         ward: data.address.ward,
    //       },
    //       description: data.description,  
    //     }
    //   },
    // );

    const address = await Address.findOne({_id: id});
    address.address = data.address;
    address.description = data.description;
    await address.save();
 
    console.log(address);

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

module.exports = {
  findAllLocation,
  findAllStudentTypes,
  getStudentTypeById,
  storeStudentType,
  storeAddress,
  updateAddress,
};
