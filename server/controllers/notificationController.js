const { getNotificationByUser } = require("../repository/notificationRepository");

const getNotification = async (req, res) => {
  try {
    const noti = await getNotificationByUser(req.user)
    res.status(200).json({ success: true, notifications: noti });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getNotification,
};
