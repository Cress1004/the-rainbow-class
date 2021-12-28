const { Lesson } = require("../models/Lesson");
const { storeNewSchedule } = require("./scheduleRepository");

const storeNewLesson = async (data) => {
  try {
    const schedule = await storeNewSchedule({
      scheduleType: 0,
      teachOption: data.teachOption,
      address: {
        address: data.address,
        description: data.description,
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

module.exports = { storeNewLesson, getLessonsByCLass };
