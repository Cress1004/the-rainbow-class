const {
  getNotificationByUser,
  updateNotificationStatusRead,
} = require("../repository/notificationRepository");

const getNotification = async (req, res) => {
  try {
    const params = req.query;
    const noti = await getNotificationByUser(req.user, params);
    res.status(200).json({ success: true, notifications: noti });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateNotiStatus = async (req, res) => {
  try {
    const notiId = req.params.id;
    await updateNotificationStatusRead(notiId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getNotification,
  updateNotiStatus
};
