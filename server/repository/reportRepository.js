const { compareObjectId } = require("../function/commonFunction");
const { Report } = require("../models/Report");
const { storeNewAchievement } = require("./achievementRepository");
const {
  getStudentByClass,
  getStudentByClassId,
} = require("./studentRepository");

const saveNewReport = async (data) => {
  try {
    const newAchievement = await storeNewAchievement({
      student: data.student,
      lesson: data.lesson,
      point: data.point,
      comment: data.comment,
    });
    const newReport = await new Report({
      lessonDescription: data.lessonDescription,
      createdBy: data.volunteer,
      achievement: newAchievement._id,
      subject: data.subject,
      pair: data.pair,
    });
    return newReport.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getReportsByPair = async (pairId, month) => {
  try {
    const reports = await Report.find({ pair: pairId })
      .populate({
        path: "achievement",
        populate: [
          {
            path: "student",
            select: "user",
            populate: { path: "user", select: "name" },
          },
          {
            path: "lesson",
            select: "title schedule",
            populate: { path: "schedule", select: "time" },
          },
        ],
      })
      .populate({
        path: "subject",
        select: "title",
      })
      .populate({
        path: "pair",
        populate: {
          path: "volunteer",
          select: "user",
          populate: { path: "user", select: "name" },
        },
      })
      .sort({ createdAt: -1 });
    const result = reports.filter((item) => {
      const monthTime = item.achievement.lesson.schedule.time.date.slice(0, 7);
      return monthTime == month;
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const saveTeachByClassReports = async (reports) => {
  try {
    for (var i = 0; i < reports.length; i++) {
      await saveNewReport(reports[i]);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getReportsByVolunteer = async (volunteerId, month) => {
  try {
    const reports = await Report.find({ createdBy: volunteerId })
      .populate({
        path: "achievement",
        populate: [
          {
            path: "student",
            select: "user",
            populate: { path: "user", select: "name" },
          },
          {
            path: "lesson",
            select: "title schedule",
            populate: { path: "schedule", select: "time" },
          },
        ],
      })
      .populate({ path: "subject", select: "title" })
      .sort({ createdAt: -1 });
    const result = reports.filter((item) => {
      const monthTime = item.achievement.lesson.schedule.time.date.slice(0, 7);
      return monthTime == month;
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getReportByStudent = async (reports, student) => {
  return {
    student: student,
    achievement: reports.filter((item) =>
      compareObjectId(item.achievement?.student._id, student?._id)
    ),
  };
};

const getReportsByClass = async (classId, month) => {
  try {
    const reports = await Report.find({})
      .populate({
        path: "achievement",
        populate: [
          {
            path: "student",
            select: "user",
            populate: { path: "user", select: "name class" },
          },
          {
            path: "lesson",
            select: "title schedule",
            populate: { path: "schedule", select: "time" },
          },
        ],
      })
      .populate({
        path: "createdBy",
        select: "user",
        populate: { path: "user", select: "name class" },
      })
      .sort({ createdAt: -1 });
    const result = reports.filter((item) => {
      const monthTime = item.achievement.lesson.schedule.time.date.slice(0, 7);
      return (
        monthTime == month &&
        compareObjectId(item.achievement.student.user.class, classId)
      );
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  saveNewReport,
  getReportsByPair,
  saveTeachByClassReports,
  getReportsByVolunteer,
  getReportsByClass,
  getReportByStudent,
};
