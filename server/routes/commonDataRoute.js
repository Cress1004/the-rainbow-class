const express = require('express');
const { getLocation, getStudentTypes, addStudentType } = require('../controllers/commonDataController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/location", auth, getLocation);
router.post("/student-types", auth, getStudentTypes);
router.post("/add-student-type", auth, addStudentType)

module.exports = router;
