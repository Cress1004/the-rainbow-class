require("dotenv").config();
const multer = require("multer");
const {
  DEFAULT_AVATAR_PATH,
  DEFAULT_CV_PATH,
} = require("../defaultValues/constant");
const { storeCV } = require("../repository/cvRepository");
const { uploadCVFile, uploadImage } = require("../services/uploadServices");

const uploadAvatar = async (req, res) => {
  uploadImage.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log("fail to upload avatar");
    }
    try {
      const link = `${DEFAULT_AVATAR_PATH}${req.file.filename}`;
      res.status(200).json({ success: true, link: link });
    } catch (error) {
      console.log("fail to get link avatar");
    }
  });
};

const createNewCV = async (req, res) => {
  uploadCVFile.single("cvFile")(req, res, (err) => {
    let message;
    const userData = req.body;
    if (err instanceof multer.MulterError) {
      message = "fail to upload cv file!";
      res.status(200).json({ success: false, message: message });
    }
    try {
      console.log(req.file)
      const link = `${DEFAULT_CV_PATH}${req.file.filename}`;
      storeCV(userData, link);
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return null;
    }
  });
};

module.exports = {
  uploadAvatar,
  createNewCV,
};
