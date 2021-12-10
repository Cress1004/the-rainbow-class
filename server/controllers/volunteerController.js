const { storeVolunteer, getListVolunteers } = require("../repository/volunteerRepository");

const addNewVolunteer = async (req, res) => {
  try {
    await storeVolunteer(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllVolunteer = async (req, res) => {
  try {
    const volunteers = await getListVolunteers(req.body);
    res.status(200).json({ success: true, volunteers: volunteers });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addNewVolunteer, getAllVolunteer };
