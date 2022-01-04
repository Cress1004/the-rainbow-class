const express = require('express');
const { uploadAvatar } = require('../controllers/uploadController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/upload-avatar", auth, uploadAvatar);

module.exports = router;
