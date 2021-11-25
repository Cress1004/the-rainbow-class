const express = require('express');
const { getLocation } = require('../controllers/common-data');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/location", auth, getLocation);

module.exports = router;
