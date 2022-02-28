const express = require('express');
const { uploadAvatar, uploadCV } = require('../controllers/uploadController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/upload-avatar", auth, uploadAvatar);
router.post("/upload-cv-file", uploadCV);

module.exports = router;
