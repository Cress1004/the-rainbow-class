const { updateAchievement } = require("../repository/achievementRepository");

const updateCommentStudent = async (req, res) => {
  try {
    await updateAchievement(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  updateCommentStudent,
};
