const { Lesson } = require("../models/Lesson");
const { deleteAddress } = require("./commonRepository");
const {
  storeNewSchedule,
  deleteSchedule,
  updateSchedule,
} = require("./scheduleRepository");

const storeNewLesson = async (data) => {
  try {
    console.log(data.pairId)
    const schedule = await storeNewSchedule({
      scheduleType: 0,
      teachOption: data.teachOption,
      address: data.address,
      linkOnline: data.linkOnline,
      time: data.time,
    });
    const newLesson = await new Lesson({
      title: data.name,
      description: data.description,
      schedule: schedule._id,
      class: data.classId,
      pairTeaching: data.pairId
    });
    return newLesson.save();
  } catch (error) {
    return null;
  }
};

const getLessonsByCLass = async (classId) => {
  try {
    if (classId == 0) {
      return await getAllLessonsByClass();
    } else {
      return await Lesson.find({ class: classId })
        .populate({
          path: "schedule",
          populate: { path: "personInCharge", select: "name" },
        })
        .populate("class");
    }
  } catch (error) {
    console.log(e);
  }
};

const findLesson = async (lessonId) => {
  try {
    return await Lesson.findOne({ _id: lessonId }).populate({
      path: "schedule",
      populate: { path: "address paticipants personInCharge" },
    });
  } catch (error) {
    console.log("fail to get lesson by class id");
  }
};

const getLessonBySchedule = async (scheduleId) => {
  try {
    return Lesson.findOne({ schedule: scheduleId }).populate([
      {
        path: "schedule",
        populate: [
          {
            path: "personInCharge",
            select: "name email phoneNumber ",
          },
          { path: "address" },
          { path: "paticipants", select: "name email phoneNumber" },
        ],
      },
      { path: "class", select: "name" },
    ]);
  } catch (error) {
    console.log("fail to delete lesson");
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
      address: lessonData?.address,
      time: lessonData.time,
    });
    return lesson.save();
  } catch (error) {
    console.log("fail to edit lesson");
  }
};

const getAllLessonsByClass = async () => {
  try {
    return await Lesson.find({})
      .populate({
        path: "schedule",
        populate: { path: "address paticipants personInCharge" },
      })
      .populate("class");
  } catch (error) {
    console.log("fail to get user schedule");
  }
};

const getLessonsByPairId = async (pairId) => {
  try {
    return await Lesson.find({ pairTeaching: pairId })
      .populate({
        path: "schedule",
        populate: { path: "address paticipants personInCharge" },
      })
      .populate("class");
  } catch (error) {
    console.log("fail to get user schedule");
  }
};

module.exports = {
  storeNewLesson,
  getLessonsByCLass,
  findLesson,
  deleteLesson,
  editLesson,
  getLessonBySchedule,
  getAllLessonsByClass,
  getLessonsByPairId,
};
