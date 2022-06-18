require("dotenv").config();

const { User } = require("../models/User");
const nodemailer = require("nodemailer");
const {
  getUserData,
  updateProfile,
  changeAvatar,
  getUserDataByEmail,
  getUserDataById,
  comparePassword,
} = require("../repository/userRepository");
const fs = require("fs");
const handlebars = require("handlebars");
const { promisify } = require("util");
const crypto = require("crypto");
const { getCurrentUserRole } = require("./userController");
const readFile = promisify(fs.readFile);
const { OAuth2Client } = require("google-auth-library");

const myOAuth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const authentication = async (req, res) => {
  const user = req.user;
  const currentUserData = await getCurrentUserRole(user);
  res.status(200).json({
    _id: user._id,
    isAuth: true,
    email: user.email,
    name: user.name,
    role: currentUserData,
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

const generateTokenToResetPassword = async (email) => {
  try {
    var user = await getUserDataByEmail(email);
    var token = crypto.randomBytes(64).toString("hex");
    user.token = token;
    return user.save();
  } catch (error) {
    return "Generate token fail";
  }
};

const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    if (!user.isActive) {
      return res.json({
        loginSuccess: false,
        message: "Account was not active",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({
          loginSuccess: true,
          userId: user._id,
          w_authExp: user.tokenExp,
          w_auth: user.token,
        });
        // res
          // .cookie("w_auth", user.token, {
          //   httpOnly: true,
          //   secure: true,
          //   sameSite: "none",
          // })
          // .status(200)
          // .json({
          //   loginSuccess: true,
          //   userId: user._id,
          // });
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

const resetPassword = async (req, res) => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const resetEmail = req.body.resetEmail;
    const user = await generateTokenToResetPassword(resetEmail);
    let html = await readFile("./server/mail/ResetPassword.html", "utf8");
    let template = handlebars.compile(html);
    const data = {
      username: user.name,
      token: user.token,
    };
    let htmlToSend = template(data);
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.SEND_EMAIL_ADDRESS,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    const mailOptions = {
      from: process.env.SEND_EMAIL_ADDRESS,
      to: resetEmail,
      subject: "Reset Password",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const activeAccount = async (email) => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const user = await generateTokenToResetPassword(email);
    let html = await readFile("./server/mail/ActiveAccount.html", "utf8");
    let template = handlebars.compile(html);
    const data = {
      username: user.name,
      token: user.token,
    };
    let htmlToSend = template(data);
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.SEND_EMAIL_ADDRESS,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    const mailOptions = {
      from: process.env.SEND_EMAIL_ADDRESS,
      to: email,
      subject: "Active Account",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

const setNewPassword = async (req, res) => {
  try {
    const data = req.body;
    const user = await getUserDataByEmail(data.resetEmail);
    if (user.token === data.verifyToken) {
      user.password = data.newPassword;
      user.isActive = true;
      await user.save();
      res.status(200).json({ success: true });
    }
    if (!user)
      res.status(200).json({
        success: false,
        message: "Không thành công do thông tin tài khoản không chính xác!",
      });
    else {
      res.status(200).json({ success: false, message: "Lỗi hệ thống" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userData = await getUserData(req.user._id);
    res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    await updateProfile(req.user, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    await changeAvatar(req.user, req.body.newAvtLink);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const data = req.body;
    const user = await getUserDataById(data.userId);
    if (await comparePassword(user, data.password)) {
      user.password = data.password.newPassword;
      user.save();
      res.status(200).json({ success: true });
    } else {
      res
        .status(200)
        .json({ success: false, message: "Old password is not match" });
    }
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
  changePassword,
  setNewPassword,
  activeAccount,
};
