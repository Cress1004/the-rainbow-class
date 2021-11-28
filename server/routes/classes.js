const express = require('express');
const { addClass } = require('../controllers/class');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/add-class", auth, addClass);

module.exports = router;
