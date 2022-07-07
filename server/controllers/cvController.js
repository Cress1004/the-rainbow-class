const { getAllCV, getCVById, updateCV, getAllCVs } = require("../repository/cvRepository");

const getListCV = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const currentVolunteer = req.currentVolunteer;
    const params = req.query;
    const cvList = await getAllCV(currentUser, currentVolunteer, params);
    res.status(200).json({ success: true, cvList: cvList.documents, totalNumberOfCV: cvList.count, message: cvList.message });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCVDataById = async (req, res) => {
  try {
    const cvId = req.params.id;
    const currentUser = req.currentUser;
    const currentVolunteer = req.currentVolunteer;
    const cvData = await getCVById(cvId, currentUser, currentVolunteer);
    res.status(200).json({ success: true, cvData: cvData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateCVStatus = async (req, res) => {
  try {
    const cvData = req.body;
    await updateCV(cvData, req.currentUser, req.currentVolunteer);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getNumberOfCV = async (req, res) => {
  try {
   const allCV = await getAllCVs();
   const cvData = {
     totalCV: allCV.length,
     pendingCV: allCV.filter(item => item.status === 0).length,
     waitingCV: allCV.filter(item => item.status === 1).length,
   }
    res.status(200).json({ success: true, cvData: cvData });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getListCV,
  getCVDataById,
  updateCVStatus,
  getNumberOfCV
};
