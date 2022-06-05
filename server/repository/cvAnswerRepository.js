const { CVAnswer } = require("../models/CVAnswer");

const storeCVAnswer = async (data) => {
  try {
    const newAnswer = await new CVAnswer(data);
    return newAnswer.save();
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getCVAnswerByCVId = async (cvId) => {
  try {
    const answers = await CVAnswer.find({ cv: cvId })
      .select("cv question content")
      .populate({
        path: "question",
      })
    return answers;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  storeCVAnswer,
  getCVAnswerByCVId,
};
