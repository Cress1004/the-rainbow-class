require("dotenv").config();

const { User } = require("../models/User");
const nodemailer = require("nodemailer");
const {
  getUserData,
  updateProfile,
  changeAvatar,
} = require("../repository/userRepository");

const authentication = (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
};

const register = (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
};

const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
};

const logout = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
};

const resetPassword = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.SEND_EMAIL_ADDRESS,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SEND_EMAIL_ADDRESS,
    to: "leader.t.n.t.ship@gmail.com",
    subject: "Test2",
    text: "Test mail services",
  };
  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfuly");
    }
  });
};

const getUserProfile = async (req, res) => {
  try {
    const userData = await getUserData(req.body.userId);
    res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    await updateProfile(req.body.userData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    await changeAvatar(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  authentication,
  login,
  logout,
  register,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateAvatar,
};
