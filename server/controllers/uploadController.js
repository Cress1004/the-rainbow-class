require("dotenv").config();
const multer = require("multer");
const path = require('path');
const { DEFAULT_AVATAR_PATH } = require("../defaultValues/constant");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/avatars" )
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const uploadAvatar = async (req, res) => {
  upload.single("avatar")(req, res, (err) => {
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

module.exports = {
  uploadAvatar,
};
