const { ClassName } = require("../models/ClassName");
const { storeAddress, updateAddress } = require("./commonRepository");

const findAllClasses = () => {
  return ClassName.find({});
};

const findClassById = (id) => {
  return ClassName.findOne({ _id: id });
};

const storeClass = (data) => {
  const newAddress = storeAddress(data.address);
  const classData = {
    name: data.name,
    description: data.description,
    studentTypes: data.studentTypes,
    address: newAddress._id,
    defaultSchedule: data.defaultSchedule,
  };
  const newClass = new ClassName(classData);
  newClass.save();
  return newClass;
};

const editClass = async (data) => {
  try {
    const className = await findClassById({ _id: data._id });
    if (className.address) {
      await updateAddress(className.address, data.address);
    } else {
      const address = await storeAddress(data.address);
      className.address = address._id;
    }
    className.name = data.name;
    className.description = data.description;
    className.studentTypes = data.studentTypes;
    className.defaultSchedule = data.defaultSchedule;
    className.save();
    return className;
  } catch (error) {
    console.log("edit class data fail");
  }
};

const deleteClass = (id) => {
  return ClassName.deleteOne({ _id: id });
};

const tranformClassData = async (className) => {
  try {
    const classData = await ClassName.findOne({ _id: className._id })
      .populate("studentTypes")
      .populate("address", "_id address description");
    return classData;
  } catch (error) {
    console.log("fail");
  }
};

module.exports = {
  findAllClasses,
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
};
