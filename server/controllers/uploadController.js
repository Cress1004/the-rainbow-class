require("dotenv").config();
const multer = require("multer");
const path = require("path");
const {
  DEFAULT_AVATAR_PATH,
  DEFAULT_CV_PATH,
} = require("../defaultValues/constant");
const { storeCV } = require("../repository/cvRepository");

const randomUnixSuffix = () => {
  return Date.now() + "-" + Math.round(Math.random() * 1e9);
};

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/avatars" )
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = randomUnixSuffix() + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const uploadImage = multer({ storage: storageImage })

const uploadAvatar = async (req, res) => {
  uploadImage.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log("fail to upload avatar");
    }
    try {
      const link = `${DEFAULT_AVATAR_PATH}${req.file.filename}`;
      res.status(200).json({ success: true, link: link });
    } catch (error) {
        console.log("fail to upload avatar");
    }
  });
};

const storageCVFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/cv");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = randomUnixSuffix() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const uploadCVFile = multer({ storage: storageCVFile });

const uploadCV = async (req, res) => {
  uploadCVFile.single("cvFile")(req, res, (err) => {
    let message;
    const userData = req.body;
    if (err instanceof multer.MulterError) {
      message = "fail to upload cv file!";
      res.status(200).json({ success: false, message: message });
    }
    try {
      const link = `${DEFAULT_CV_PATH}${req.file.filename}`;
      storeCV({
        userName: userData.userName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        cvFileLink: link,
        class: userData.selectedClass,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.log("fail to upload CV");
    }
  });
};

module.exports = {
  uploadAvatar,
  uploadCV,
};
