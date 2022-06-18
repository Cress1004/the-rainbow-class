const { getCVAnswerByCVId } = require("../repository/cvAnswerRepository");

const getAnswerWithCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const answers = await getCVAnswerByCVId(cvId);
    res.status(200).json({ success: true, answers: answers });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAnswerWithCV,
};
