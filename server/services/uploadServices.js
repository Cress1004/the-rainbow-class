const multer = require("multer");
const path = require("path");
const { CV_FOLDER_PATH, AVATAR_FOLDER_PATH } = require("../defaultValues/constant");
const { randomUnixSuffix } = require("../function/commonFunction");

const storageCVFile = (folderPath) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = randomUnixSuffix() + path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

const uploadImage = multer({ storage: storageCVFile(AVATAR_FOLDER_PATH) });

const uploadCVFile = multer({ storage: storageCVFile(CV_FOLDER_PATH) });

module.exports = { uploadCVFile, uploadImage };
