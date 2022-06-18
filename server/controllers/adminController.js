const { getAdminList } = require("../repository/volunteerRepository");

const getAllAdmin = async (req, res) => {
  try {
    const params = req.query;
    const admin = await getAdminList(params);
    res.status(200).json({ success: true, admin: admin.documents, message: admin.message });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAllAdmin,
};
