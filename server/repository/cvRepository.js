const { compareObjectId } = require("../function/commonFunction");
const { CV } = require("../models/CV");
const { storeCVAnswer } = require("./cvAnswerRepository");
const { storeFreeTime, getFreeTimeByCVId } = require("./freeTimeRepository");
const { createCVNotification } = require("./notificationRepository");
const {
  storeInterviewSchedule,
  updateInterviewSchedule,
} = require("./scheduleRepository");

const storeCV = async (userData, cvLink, audioLink) => {
  try {
    const cvData = {
      userName: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      cvFileLink: cvLink,
      audioFileLink: audioLink,
      class: userData.selectedClass,
      note: userData.note,
    };
    const cvAnswers = JSON.parse(userData.answers);
    const freeTimeList = JSON.parse(userData.freeTime);

    const cv = await new CV(cvData);
    for (const item of cvAnswers) {
      await storeCVAnswer({
        cv: cv._id,
        question: item.questionId,
        content: item.content,
      });
    }
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
        .select("userName email phoneNumber status class created_at")
        .populate({
          path: "class",
          select: "name",
        })
        .sort({ status: 0, created_at: 1 });
    } else {
      return CV.find({ class: currentUser.class })
        .select("userName email phoneNumber status class created_at")
        .populate({
          path: "class",
          select: "name",
        })
        .sort({ status: 0, created_at: 1 });
    }
  } catch (error) {
    console.log("Fail to get all CV");
    return null;
  }
};

const getAllCVs = async (currentUser, currentVolunteer) => {
  try {
    return CV.find({})
      .select("status")
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
        await updateInterviewSchedule(cv, interviewTime, cvData.participants);
      } else {
        var schedule = await storeInterviewSchedule({
          scheduleType: 2,
          time: interviewTime,
          paticipants: cvData.participants,
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

const getCVBySchedule = async (scheduleId) => {
  try {
    return CV.findOne({ schedule: scheduleId }).populate([
      {
        path: "schedule",
        populate: [
          {
            path: "personInCharge",
            select: "name email phoneNumber ",
          },
          { path: "address" },
          { path: "paticipants", select: "name email phoneNumber" },
        ],
      },
      { path: "class", select: "name" },
    ]);
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
  getInterviewSchedule,
  getCVBySchedule,
  getAllCVs
};
