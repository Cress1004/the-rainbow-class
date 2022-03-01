const { CV } = require("../models/CV");

const storeCV = async (data) => {
  try {
    const newCV = await new CV(data);
    return newCV.save();
  } catch (error) {
    console.log("Fail to store CV");
    return null;
  }
};

const getAllCV = async (currentUser, currentVolunteer) => {
  try {
    if (currentVolunteer.isAdmin) {
      return CV.find({})
        .select("userName email phoneNumber status class")
        .populate({
          path: "class",
          select: "name",
        })
        .sort({ status : 0, created_at: -1 });
    } else {
      return CV.find({ class: currentUser.class })
        .select("userName email phoneNumber status class")
        .populate({
          path: "class",
          select: "name",
        })
        .sort({ status: 0, created_at: -1 });
    }
  } catch (error) {
    console.log("Fail to get all CV");
    return null;
  }
};

module.exports = {
  storeCV,
  getAllCV,
};
