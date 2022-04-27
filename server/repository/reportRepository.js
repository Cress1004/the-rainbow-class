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

module.exports = {
  saveNewReport,
};
