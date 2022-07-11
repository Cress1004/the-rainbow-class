const { getLessonsByPairId } = require("../repository/lessonRepository");
const { getPairById } = require("../repository/pairTeachingRepository");

const getLessonsByPair = async (req, res) => {
  try {
    const pairId = req.params.pairId;
    const lessons = await getLessonsByPairId(pairId);
    res.status(200).json({ success: true, lessons: lessons });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPairData = async (req, res) => {
  try {
    const pairId = req.params.pairId;
    const pairData = await getPairById(pairId);
    res.status(200).json({ success: true, pairData: pairData });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getLessonsByPair,
  getPairData
};
