require("dotenv").config();
const multer = require("multer");
const { storeCV } = require("../repository/cvRepository");
const { uploadCVFile, uploadImage } = require("../services/uploadServices");

const uploadAvatar = async (req, res) => {
  uploadImage.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log("fail to upload avatar");
    }
    try {
      const link = req.file.url;
      res.status(200).json({ success: true, link: link });
    } catch (error) {
      console.log("fail to get link avatar");
    }
  });
};

const createNewCV = async (req, res) => {
  uploadCVFile.any()(req, res, (err) => {
    let message;
    const userData = req.body;
    if (err instanceof multer.MulterError) {
      message = "fail to upload cv file!";
      res.status(200).json({ success: false, message: message });
    }
    try {
      const cvLink = req.files[0].url;
      const audioLink = req.files[1]?.url;
      storeCV(userData, cvLink, audioLink);
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
