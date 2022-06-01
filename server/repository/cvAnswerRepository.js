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

module.exports = {
  storeCVAnswer,
};
