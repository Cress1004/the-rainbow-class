const { Report } = require("../models/Report");
const { storeNewAchievement } = require("./achievementRepository");

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

module.exports = {
  saveNewReport,
  getReportsByPair,
};
