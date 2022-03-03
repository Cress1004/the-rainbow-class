const { getAllCV, getCVById } = require("../repository/cvRepository");

const getListCV = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const currentVolunteer = req.currentVolunteer;
    const cvList = await getAllCV(currentUser, currentVolunteer);
    res.status(200).json({ success: true, cvList: cvList });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCVDataById = async (req, res) => {
  try {
    const cvId = req.body.cvId;
    const currentUser = req.currentUser;
    const currentVolunteer = req.currentVolunteer;
    const cvData = await getCVById(cvId, currentUser, currentVolunteer);
    res.status(200).json({ success: true, cvData: cvData });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getListCV,
  getCVDataById
};
