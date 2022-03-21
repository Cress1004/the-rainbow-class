const { compareObjectId } = require("../function/commonFunction");
const { CV } = require("../models/CV");
const { storeFreeTime, getFreeTimeByCVId } = require("./freeTimeRepository");
const { createCVNotification } = require("./notificationRepository");
const {
  storeInterviewSchedule,
  updateSchedule,
  updateInterviewSchedule,
} = require("./scheduleRepository");

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
    cv.save();
    await createCVNotification(cv);
    return cv;
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
    let cvData = await CV.findOne({ _id: cvId }).populate([
      {
        path: "class",
        select: "name",
      },
      { path: "schedule" },
    ]);
    if (
      currentVolunteer.isAdmin ||
      compareObjectId(currentUser.class, cvData.class._id)
    ) {
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
        var interviewTime = {
          date: cvData.date,
          startTime: cvData.startTime,
          endTime: cvData.endTime,
        };
      if (cv.schedule) {
        await updateInterviewSchedule(cv, interviewTime);
      } else {
        var schedule = await storeInterviewSchedule({
          scheduleType: 2,
          time: interviewTime,
        });
        cv.schedule = schedule._id;
      }
      return cv.save();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getInterviewSchedule = async (classId) => {
  try {
    if (classId == 0) {
      return await getAllInterviewsByClass();
    } else {
      return await CV.find({ class: classId })
        .populate({
          path: "schedule",
          populate: { path: "personInCharge", select: "name" },
        })
        .populate("class");
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllInterviewsByClass = async () => {
  try {
    return await CV.find({})
      .populate({
        path: "schedule",
        populate: { path: "address paticipants personInCharge" },
      })
      .populate("class");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  storeCV,
  getAllCV,
  getCVById,
  updateCV,
  getInterviewSchedule,
};
