const { compareObjectId } = require("../function/commonFunction");
const { Lesson } = require("../models/Lesson");
const { deleteAddress } = require("./commonRepository");
const { createNewNoti } = require("./notificationRepository");
const {
  storeNewSchedule,
  deleteSchedule,
  updateSchedule,
} = require("./scheduleRepository");
const {
  getVolunteerByClass,
  getVolunteerByClassId,
} = require("./volunteerRepository");

const storeNewLesson = async (data) => {
  try {
    const schedule = await storeNewSchedule(
      {
        scheduleType: 0,
        teachOption: data.teachOption,
        address: data.address,
        linkOnline: data.linkOnline,
        time: data.time,
      },
      data.pairId
    );
    const newLesson = await new Lesson({
      title: data.name,
      description: data.description,
      schedule: schedule._id,
      class: data.classId,
      pairTeaching: data.pairId,
    });
    // const sendNotiUsers = await getVolunteerByClassId(data.classId);
    // for (let i = 0; i < sendNotiUsers.length; i++) {
    //   await createNewNoti({userId: sendNotiUsers[i].user._id, type: 2, content: {path: '', class: }})
    // }
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
        .populate("class")
        .sort({ created_at: -1 });
    }
  } catch (error) {
    console.log(e);
  }
};

const findLesson = async (lessonId) => {
  try {
    return await Lesson.findOne({ _id: lessonId }).populate({
      path: "schedule",
      populate: { path: "address participants personInCharge" },
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
          { path: "participants", select: "name email phoneNumber" },
        ],
      },
      { path: "class", select: "name" },
    ]);
  } catch (error) {
    console.log(error);
    return null;
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
        populate: { path: "address participants personInCharge" },
      })
      .populate("class")
      .sort({ created_at: -1 });
  } catch (error) {
    console.log("fail to get user schedule");
  }
};

const getLessonsByPairId = async (pairId) => {
  try {
    return await Lesson.find({ pairTeaching: pairId })
      .populate({
        path: "schedule",
        populate: { path: "address participants personInCharge" },
      })
      .populate("class");
  } catch (error) {
    console.log(error);
  }
};

const getReportByLesson = async (reports, lesson) => {
  return {
    lesson: lesson,
    report: reports.filter((item) =>
      compareObjectId(item.achievement?.lesson._id, lesson?._id)
    ),
  };
};

const getLessonByClassAndMonth = async (classId, month) => {
  try {
    const lessons = await Lesson.find({ class: classId })
      .populate("schedule")
      .sort({ createdAt: -1 });
    const result = lessons.filter((lesson) => {
      const monthTime = lesson.schedule.time.date.slice(0, 7);
      return monthTime == month;
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
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
  getLessonByClassAndMonth,
  getReportByLesson,
};
