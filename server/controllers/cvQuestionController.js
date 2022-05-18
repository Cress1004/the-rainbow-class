const constant = require("../defaultValues/constant");
const { storeQuestion, getAllActiveQuestions, editQuestionData, removeQuestion } = require("../repository/cvQuestionRepository");

const addNewQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    await storeQuestion(questionData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editQuestion = async (req, res) => {
    try {
      const questionData = req.body;
      await editQuestionData(questionData);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).send(error);
    }
  };

const getAllCVQuestions = async (req, res) => {
  try {
    const questions = await getAllActiveQuestions();
    res.status(200).json({ success: true, questions: questions });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteQuestion = async (req, res) => {
    try {
      const questionId = req.params.id
      await removeQuestion(questionId)
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).send(error);
    }
  };

module.exports = {
  addNewQuestion,
  getAllCVQuestions,
  editQuestion,
  deleteQuestion
};
