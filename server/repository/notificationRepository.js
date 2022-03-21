const { NotiCV } = require("../models/NotiCV");
const { Notification } = require("../models/Notification");
const { findClassById } = require("./classRepository");
const { getCurrentClassMonitorAndAdmin } = require("./volunteerRepository");

const createCVNotification = async (cv) => {
  try {
    const classMonitorAndAdmin = await getCurrentClassMonitorAndAdmin(cv.class);
    for (const item of classMonitorAndAdmin) {
      const noti = await new Notification({ user: item.user._id, type: 0 });
      const notiCV = await new NotiCV({ cv: cv._id, notification: noti._id });
      noti.save();
      notiCV.save();
    }
    return classMonitorAndAdmin;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getNotificationByUser = async (user) => {
  try {
    return Notification.find({ user: user._id });
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createCVNotification,
  getNotificationByUser,
};
