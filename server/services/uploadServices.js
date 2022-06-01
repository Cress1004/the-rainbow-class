const multer = require("multer");
const path = require("path");
const { CV_FOLDER_PATH, AVATAR_FOLDER_PATH } = require("../defaultValues/constant");
const { randomUnixSuffix } = require("../function/commonFunction");

const storageFile = (folderPath) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = randomUnixSuffix() + path.extname(file.originalname);
      cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix);
    },
  });

const uploadImage = multer({ storage: storageFile(AVATAR_FOLDER_PATH) });

const uploadCVFile = multer({ storage: storageFile(CV_FOLDER_PATH) });

module.exports = { uploadCVFile, uploadImage };
