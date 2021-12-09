const express = require('express');
const { getLocation, getStudentTypes, addStudentType, deleteStudentType } = require('../controllers/commonDataController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/location", auth, getLocation);
router.post("/student-types", auth, getStudentTypes);
router.post("/add-student-type", auth, addStudentType)
router.post("/student-types/:id", auth, deleteStudentType);

module.exports = router;
