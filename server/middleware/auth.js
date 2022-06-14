const { request } = require("express");
const {
  STUDENT_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { getCookie } = require("../function/getCookies");
const { User } = require("../models/User");
const { findUserByToken } = require("../repository/userRepository");
const { getVolunteerByUserId } = require("../repository/volunteerRepository");

let auth = (req, res, next) => {
  let cookies = req.get("Cookies");
  let token = getCookie(cookies, "w_auth");
  console.log(token);

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

const checkAdminAndMonitorRole = async (req, res, next) => {
  let token = req.cookies.w_auth;
  try {
    const user = await findUserByToken(token);
    if (user.role === STUDENT_ROLE) {
      res.json({ success: false, messsage: "Permission Denied", error: true });
    } else {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (
        currentVolunteer.isAdmin ||
        currentVolunteer.role === CLASS_MONITOR ||
        currentVolunteer.role === SUB_CLASS_MONITOR
      ) {
        req.currentUser = user;
        req.currentVolunteer = currentVolunteer;
        next();
      }
      else
        res.status(200).json({
          success: false,
          messsage: "Permission Denied",
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { auth, checkAdminAndMonitorRole };
