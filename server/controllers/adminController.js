const { Volunteer } = require("../models/Volunteer");

const getAllAdmin = async (req, res) => {
  try {
    const admin = await Volunteer.find({ isAdmin: true }).populate({
      path: "user",
      select: "name email phoneNumber",
    });
    res.status(200).json({ success: true, admin: admin });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAllAdmin,
};
