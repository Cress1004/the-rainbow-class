const { getAllCV } = require("../repository/cvRepository");

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

module.exports = {
  getListCV,
};
