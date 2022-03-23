const express = require('express');
const { getLocation, getStudentTypes, addStudentType, deleteStudentType, getDistricts, getWards } = require('../controllers/commonDataController');
const { auth } = require("../middleware/auth");
const { checkAdminRole } = require('../middleware/checkRole');
const router = express.Router();

router.post("/location", auth, getLocation);
router.post("/province/:id/get-districts", auth, getDistricts);
router.post("/district/:id/get-wards", auth, getWards);
router.post("/student-types", auth, getStudentTypes);
router.post("/add-student-type", checkAdminRole, addStudentType)
router.post("/student-types/:id", checkAdminRole, deleteStudentType);

module.exports = router;
