const { CVQuestion } = require("../models/CVQuestion");

const storeQuestion = async (data) => {
  try {
    const newQuestion = await new CVQuestion(data);
    return newQuestion.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const editQuestionData = async (data) => {
  try {
    return await CVQuestion.findOneAndUpdate({ _id: data._id }, data, {
      new: true,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllActiveQuestions = async () => {
  try {
    return CVQuestion.find({ deleted: false });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllActiveQuestionsForCV = async () => {
  try {
    return CVQuestion.find({ deleted: false }).select("content isRequired");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const removeQuestion = async (id) => {
  try {
    return await CVQuestion.delete({ _id: id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  storeQuestion,
  getAllActiveQuestions,
  editQuestionData,
  removeQuestion,
  getAllActiveQuestionsForCV,
};
