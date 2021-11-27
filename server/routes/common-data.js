const express = require('express');
const { getLocation, getStudentType, addStudentType } = require('../controllers/common-data');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/location", auth, getLocation);
router.post("/student-types", auth, getStudentType);
router.post("/add-student-type", auth, addStudentType)

module.exports = router;
