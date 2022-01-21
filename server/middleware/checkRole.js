const {
  ADMIN,
  STUDENT_ROLE,
  SUPER_ADMIN,
} = require("../defaultValues/constant");
const { findUserByToken } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

const checkAdminRole = async (req, res, next) => {
  let token = req.cookies.w_auth;
  try {
    const user = await findUserByToken(token);
    if (user.role === STUDENT_ROLE) {
      res.json({ success: false, message: "Permission Denied", error: true });
    } else {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.role === ADMIN) next();
      else
        res.status(200).json({
          success: false,
          message: "Permission Denied",
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const checkAdminAndVolunteerRole = async (req, res, next) => {
  let token = req.cookies.w_auth;
  try {
    const user = await findUserByToken(token);
    if (user.role === STUDENT_ROLE) {
      res.json({ success: false, message: "Permission Denied", error: true });
    } else {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.role !== SUPER_ADMIN) next();
      else
        res.status(200).json({
          success: false,
          message: "Permission Denied",
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { checkAdminRole, checkAdminAndVolunteerRole };
