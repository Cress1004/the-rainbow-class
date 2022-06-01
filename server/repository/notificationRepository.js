const { NotiCV } = require("../models/NotiCV");
const { Notification } = require("../models/Notification");
const { getCurrentClassMonitorAndAdmin } = require("./volunteerRepository");

const createNewNoti = async (data) => {
  try {
    console.log(data)
    const newNoti= Notification.new({ user: data.userId, type: data.type });
    return newNoti.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

const getNotiCVByNoti = async (notiId) => {
  try {
    return NotiCV.findOne({ notification: notiId }).populate({
      path: "cv",
      select: "class",
      populate: [{ path: "class", select: "name" }],
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getNotificationByUser = async (user) => {
  try {
    const notis = await Notification.find({ user: user._id });
    let notisData = [];

    for (let index = 0; index < notis.length; index++) {
      switch (notis[index].type) {
        case 0:
          const notiCV = await getNotiCVByNoti(notis[index]._id);
          notisData.push({ data: notis[index], notiCV: notiCV });
          break;

        default:
          break;
      }
    }
    return notisData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateNotificationStatusRead = async (notiId) => {
  try {
    const noti = await Notification.findOne({ _id: notiId });
    noti.read = true;
    return noti.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createCVNotification,
  getNotificationByUser,
  updateNotificationStatusRead,
  createNewNoti
};
