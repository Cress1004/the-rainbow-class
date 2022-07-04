const {
  updateAchievement,
} = require("../repository/achievementRepository");
const {
  getStudentAchievementByMonth,
} = require("../repository/studentRepository");

const updateCommentStudent = async (req, res) => {
  try {
    await updateAchievement(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAchievementByStudent = async (req, res) => {
  try {
    const month = req.body.month;
    const studentId = req.body.studentId;
    const achievement = await getStudentAchievementByMonth(studentId, month);
    res.status(200).json({ success: true, achievement: achievement });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAchievementSemesterByStudent = async (req, res) => {
  try {
    const monthRange = req.body.monthRange;
    const studentId = req.body.studentId;
    let achievement = [];
    for (let index = 0; index < monthRange.length; index++) {
      
      const achievementMonth = await getStudentAchievementByMonth(studentId, monthRange[index]);
      achievement = achievement.concat(achievementMonth)
    }
    res.status(200).json({ success: true, achievement: achievement });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  updateCommentStudent,
  getAchievementByStudent,
  getAchievementSemesterByStudent,
};
