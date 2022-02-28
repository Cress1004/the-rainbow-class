const { VOLUNTEER_ROLE } = require("../defaultValues/constant");
const { ClassName } = require("../models/ClassName");
const { storeAddress, updateAddress } = require("./commonRepository");
const { getLessonsByCLass } = require("./lessonRepository");
const { getStudentByClass } = require("./studentRepository");
const { getVolunteerByClass, downgradeMonitor, upgradeMonitor } = require("./volunteerRepository");

const findAllClasses = (user) => {
  try {
    if (user.role === VOLUNTEER_ROLE) {
      return ClassName.find({});
    } else return null;
  } catch (error) {
    console.log("cant get all classes data");
    return null;
  }
};

const getAllClassesData = () => {
  try {
    return ClassName.find({});
  } catch (error) {
    console.log("cant get all classes data");
    return null;
  }
};

const findClassById = (id) => {
  try {
    if (id == 0) return null;
    return ClassName.findOne({ _id: id });
  } catch (error) {
    console.log("cannot find class by user Id");
  }
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

const getClassScheduleByUser = async (user) => {
  try {
    return await getLessonsByCLass(user.class);
  } catch (error) {
    console.log("cant get class schedule");
  }
};

const tranformClassData = async (className) => {
  try {
    const classData = await ClassName.findOne({ _id: className._id })
      .populate("studentTypes")
      .populate("address", "_id address description")
      .populate({
        path: "classMonitor",
        select: "user",
        populate: { path: "user", select: "name" },
      })
      .populate({
        path: "subClassMonitor",
        select: "user",
        populate: { path: "user", select: "name" },
      });
    classData.students = await getStudentByClass(className);
    classData.volunteers = await getVolunteerByClass(className);
    return classData;
  } catch (error) {
    console.log("transform class data fail");
  }
};

const getClassByUser = async (user) => {
  try {
    if (user.class) {
      return ClassName.findOne({ _id: user.class });
    } else {
      console.log("no class");
      return null;
    }
  } catch (error) {
    console.log("cant get class By User");
    return null;
  }
};

const setMonitor = async (classId, monitorId, subMonitorId) => {
  try {
    const currentClass = await ClassName.findOne({ _id: classId });
    await downgradeMonitor(currentClass);
    await upgradeMonitor(monitorId, subMonitorId)
    currentClass.classMonitor = monitorId;
    currentClass.subClassMonitor = subMonitorId;
    return currentClass.save();
  } catch (error) {
    console.log("cant set monitor");
    return null;
  }
};

const listClassWithName = async () => {
  try {
    return await ClassName.find({}).select('_id, name');
  } catch (error) {
    console.log("cant get all classes data");
    return null;
  }
}

module.exports = {
  findAllClasses,
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
  getClassScheduleByUser,
  getClassByUser,
  getAllClassesData,
  setMonitor,
  listClassWithName
};
