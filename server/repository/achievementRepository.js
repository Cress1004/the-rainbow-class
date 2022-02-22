const { Achievement } = require("../models/Achievement");

const getAchievementByStudentId = async (student) => {
  try {
    const achievement = await Achievement.find({ student: student._id });
    return { achievement: achievement, student: student };
  } catch (error) {
    console.log(`fail to get achievement of student ${student._id}`);
    return null;
  }
};

const updateAchievement = async (data) => {
  try {
    const lessonId = data.lessonId;
    const commentData = data.commentData;
    Promise.all(
      commentData.map(async (item) => {
        var achievement = await Achievement.findOne({ student: item.studentId, lesson: lessonId });
        if(achievement) {
          achievement.comment = item.comment;
          achievement.save();
        } else {
          var newAchievement = await new Achievement({student: item.studentId, lesson: lessonId, comment: item.comment});
          newAchievement.save();
        }
      })
    );
    return true;
  } catch (error) {
    console.log(`fail to update achievement`);
    return null;
  }
};

module.exports = {
  getAchievementByStudentId,
  updateAchievement,
};
