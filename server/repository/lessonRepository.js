const { Lesson } = require("../models/Lesson");
const { deleteAddress } = require("./commonRepository");
const {
  storeNewSchedule,
  deleteSchedule,
  updateSchedule,
} = require("./scheduleRepository");

const storeNewLesson = async (data) => {
  try {
    const schedule = await storeNewSchedule({
      scheduleType: 0,
      teachOption: data.teachOption,
      address: {
        address: {
          province: data.address.address.province,
          district: data.address.address.district,
          ward: data.address.address.ward,
        },
        description: data.address.description,
      },
      linkOnline: data.linkOnline,
      time: data.time,
    });
    const newLesson = await new Lesson({
      title: data.title,
      description: data.description,
      schedule: schedule._id,
      class: data.classId,
    });
    return newLesson.save();
  } catch (error) {
    console.log("fail to store lesson");
  }
};

const getLessonsByCLass = async (classId) => {
  try {
    return await Lesson.find({ class: classId }).populate("schedule");
  } catch (error) {
    console.log("fail to get list lesson by class id");
  }
};

const findLesson = async (lessonId) => {
  try {
    return await Lesson.findOne({ _id: lessonId }).populate({
      path: "schedule",
      populate: { path: "address paticipants" },
    });
  } catch (error) {
    console.log("fail to get list lesson by class id");
  }
};

const deleteLesson = async (lessonId) => {
  try {
    const lesson = await findLesson(lessonId);
    await deleteSchedule(lesson.schedule._id);
    await deleteAddress(lesson.schedule.address._id);
    await Lesson.findByIdAndDelete(lesson._id);
  } catch (error) {
    console.log("fail to delete lesson");
  }
};

const editLesson = async (lessonData) => {
  try {
    const lesson = await findLesson(lessonData._id);
    lesson.title = lessonData.title;
    lesson.description = lessonData.description;
    await updateSchedule({
      _id: lessonData.scheduleId,
      teachOption: lessonData.teachOption,
      linkOnline: lessonData.linkOnline,
      address: lessonData.address,
      time: lessonData.time,
    });
    lesson.save();
  } catch (error) {
    console.log("fail to delete lesson");
  }
};

module.exports = {
  storeNewLesson,
  getLessonsByCLass,
  findLesson,
  deleteLesson,
  editLesson,
};
