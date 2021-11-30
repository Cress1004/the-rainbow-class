const { ClassName } = require("../models/ClassName");
const { storeAddress } = require("./commonRepository");

const findAllClasses = () => {
  return ClassName.find({});
};

const findClassById = (id) => {
    return ClassName.findOne({ _id: id});
}

const storeClass = (data) => {
    const newAddress = storeAddress(data.address);
    const classData = {
        class_name: data.class_name,
        description: data.description,
        student_types: data.student_types,
        address_id: newAddress._id
    }
    const newClass = new ClassName(classData);
    newClass.save();
    return newClass;
}

const tranformClassData = async (className) => {
  try {
    const classData = await ClassName.findOne({ _id: className._id })
    .populate("student_types")
    .populate("address", "_id address description");
    return classData;
  } catch (error) {
    console.log("fail");
  }
};

module.exports = { findAllClasses, tranformClassData, storeClass, findClassById };
