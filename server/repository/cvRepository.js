const { compareObjectId } = require("../function/commonFunction");
const { CV } = require("../models/CV");
const {
  storeFreeTime,
  getFreeTimeByCV,
  getFreeTimeByCVId,
} = require("./freeTimeRepository");

const storeCV = async (userData, link) => {
  try {
    const cvData = {
      userName: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      cvFileLink: link,
      class: userData.selectedClass,
      note: userData.note,
    };
    const cv = await new CV(cvData);
    const freeTimeList = userData.freeTime.split(",");

    for (const item of freeTimeList) {
      var data = item.split("-");
      await storeFreeTime({
        cv: cv._id,
        weekDay: Number(data[0]),
        noon: Number(data[1]),
      });
    }

    return cv.save();
  } catch (error) {
    console.log(error);
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
        .sort({ status: 0, created_at: -1 });
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

const getCVById = async (cvId, currentUser, currentVolunteer) => {
  try {
    let cvData = await CV.findOne({ _id: cvId }).populate({
      path: "class",
      select: "name",
    });
    if (currentVolunteer.isAdmin || compareObjectId(currentUser.class, cvData.class._id)) {
      cvData = cvData.toJSON();
      cvData.freeTimeList = await getFreeTimeByCVId(cvId);
      return cvData;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateCV = async (cvData, currentUser, currentVolunteer) => {
  try {
    const cv = await CV.findOne({ _id: cvData.cvId });
    if (currentVolunteer.isAdmin || cv.class === currentUser.class) {
      cv.status = cvData.status;
      if (cvData.date && cvData.endTime && cvData.startTime)
        cv.interview = {
          date: cvData.date,
          startTime: cvData.startTime,
          endTime: cvData.endTime,
        };
      return cv.save();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  storeCV,
  getAllCV,
  getCVById,
  updateCV,
};
