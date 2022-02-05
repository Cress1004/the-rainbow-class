const { VOLUNTEER_ROLE, STUDENT_ROLE } = require("../defaultValues/constant");
const { ClassName } = require("../models/ClassName");
const { storeAddress, updateAddress } = require("./commonRepository");
const { getLessonsByCLass } = require("./lessonRepository");
const { getStudentByUserId } = require("./studentRepository");
const { getUserDataById } = require("./userRepository");
const { getVolunteerByUserId } = require("./volunteerRepository");

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

const getClassScheduleByUserId = async (userId) => {
  try {
    const user = await getUserDataById(userId);
    if (user.role === VOLUNTEER_ROLE) {
      const volunteer = await getVolunteerByUserId(userId);
      if (!volunteer) {
        const filterClass = await ClassName.find({}).sort({ _id: -1 }).limit(1);
        return await getLessonsByCLass(filterClass);
      }
      return await getLessonsByCLass(volunteer.class);
    }
    if (user.role === STUDENT_ROLE) {
      const student = await getStudentByUserId(userId);
      return await getLessonsByCLass(student.class);
    }
  } catch (error) {
    console.log("cant get class schedule");
  }
};

const tranformClassData = async (className) => {
  try {
    const classData = await ClassName.findOne({ _id: className._id })
      .populate("studentTypes")
      .populate("address", "_id address description");
    return classData;
  } catch (error) {
    console.log("transform class data fail");
  }
};

const getClassByUser = async (user) => {
  try {
    if (user.class) {
      return user.class;
    } else {
      console.log("no class");
      return null;
    }
  } catch (error) {
    console.log("cant get class By User");
    return null;
  }
};

module.exports = {
  findAllClasses,
  tranformClassData,
  storeClass,
  findClassById,
  deleteClass,
  editClass,
  getClassScheduleByUserId,
  getClassByUser,
  getAllClassesData,
};
