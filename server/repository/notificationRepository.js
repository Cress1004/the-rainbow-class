const { NOTI_TYPE, NOTI_PATH } = require("../defaultValues/constant");
const { NotiCV } = require("../models/NotiCV");
const { Notification } = require("../models/Notification");
const { findAll } = require("../services");
const { getCurrentClassMonitorAndAdmin, getAllAdmin } = require("./volunteerRepository");

const createNewNoti = async (data) => {
  try {
    const newNoti = await new Notification({
      user: data.userId,
      type: data.type,
      content: data.content
    });
    return newNoti.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createNotiRemindSetMonitor = async (classData) => {
  try {
    const adminList = await getAllAdmin();
    for (let index = 0; index < adminList.length; index++) {
      await createNewNoti({
        userId: adminList[index].user._id,
        type: NOTI_TYPE.NOTI_REMIND_SET_MONITOR,
        content: {
          id: classData._id,
          path: NOTI_PATH.NOTI_CLASS,
          className: classData.name,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return { message: error };
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

const getNotificationByUser = async (user, params) => {
  try {
    const notisResult = await findAll(Notification, [], {
      limit: parseInt(params.limit),
      query: { user: user._id },
      sort: ['created_at_dsc']
    });
    // const notis = notisResult.documents;
    // let notisData = [];

    // for (let index = 0; index < notis.length; index++) {
    //   switch (notis[index].type) {
    //     case 0:
    //       const notiCV = await getNotiCVByNoti(notis[index]._id);
    //       notisData.push({ data: notis[index], notiCV: notiCV });
    //       break;

    //     default:
    //       break;
    //   }
    // }
    return notisResult.documents;
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
  createNewNoti,
  createNotiRemindSetMonitor,
};
