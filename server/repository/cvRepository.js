const { compareObjectId } = require("../function/commonFunction");
const { CV } = require("../models/CV");
const { findAllCVsWithParams } = require("../services/queryByParamsServices");
const {
  sendMailInterview,
  sendMailAccount,
} = require("../services/sendMaiServices");
const { storeCVAnswer } = require("./cvAnswerRepository");
const { storeFreeTime, getFreeTimeByCVId } = require("./freeTimeRepository");
const { createCVNotification } = require("./notificationRepository");
const {
  storeInterviewSchedule,
  updateInterviewSchedule,
} = require("./scheduleRepository");
const { generateTokenToResetPassword } = require("./userRepository");
const { storeVolunteer } = require("./volunteerRepository");

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

const getAllCV = async (currentUser, currentVolunteer, params) => {
  try {
    return await findAllCVsWithParams(
      CV,
      ["userName", "phoneNumber", "email"],
      currentVolunteer.isAdmin ? null : currentUser.class,
      {
        limit: parseInt(params.limit),
        offset: (params.offset - 1) * 10,
        search: params.search,
        query: params.query ? JSON.parse(params.query) : {},
        sort: ["status_asc", "created_at_asc"],
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllCVs = async (currentUser, currentVolunteer) => {
  try {
    return CV.find({}).select("status");
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
    let sendMailStatus;
    if (currentVolunteer.isAdmin || cv.class === currentUser.class) {
      cv.status = cvData.status;
      switch (cvData.status) {
        case 1:
          if (cvData.date && cvData.endTime && cvData.startTime)
            var interviewTime = {
              date: cvData.date,
              startTime: cvData.startTime,
              endTime: cvData.endTime,
            };
          if (cv.schedule) {
            await updateInterviewSchedule(
              cv,
              interviewTime,
              cvData.participants,
              cvData.linkOnline
            );
            sendMailStatus = await sendMailInterview(
              {
                email: cv.email,
                userName: cv.userName,
                scheduleTime: interviewTime,
                link: cvData.linkOnline,
              },
              "EditInterviewTime",
              "[Lớp học Cầu Vồng] Thông báo thay đổi thời gian phỏng vấn"
            );
          } else {
            var schedule = await storeInterviewSchedule({
              scheduleType: 2,
              time: interviewTime,
              paticipants: cvData.participants,
              linkOnline: cvData.linkOnline,
            });
            cv.schedule = schedule._id;
            sendMailStatus = await sendMailInterview(
              {
                email: cv.email,
                userName: cv.userName,
                scheduleTime: interviewTime,
                link: cvData.linkOnline,
              },
              "SetInterviewTime",
              "[Lớp học Cầu Vồng] Thông báo thời gian phỏng vấn"
            );
          }
          break;
        case 2:
          await storeVolunteer({
            name: cv.userName,
            email: cv.email,
            class: cv.class,
          });
          const user = await generateTokenToResetPassword(cv.email);
          sendMailStatus =  await sendMailAccount(
            { email: cv.email, userName: cv.userName, token: user.token },
            "ActiveAccount",
            "[Lớp học Cầu Vồng] Thông báo trúng tuyển TNV"
          );
          break;
        case 3:
          sendMailStatus = await sendMailInterview(
            {
              email: cv.email,
              userName: cv.userName,
            },
            "RejectCV",
            "[Lớp học Cầu Vồng] Thông báo kết quả xét duyệt CV và phỏng vấn"
          );
          break;
        default:
          break;
      }
      if (sendMailStatus) return cv.save();
      else return { message: "fail to send mail services" };
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
  getAllCVs,
};
