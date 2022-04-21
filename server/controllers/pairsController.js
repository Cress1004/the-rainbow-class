const { getLessonsByPairId } = require("../repository/lessonRepository");

const getLessonsByPair = async (req, res) => {
  try {
    const pairId = req.params.pairId;
    const lessons = await getLessonsByPairId(pairId);
    res.status(200).json({ success: true, lessons: lessons });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getLessonsByPair,
};
