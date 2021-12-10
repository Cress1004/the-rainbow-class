const express = require('express');
const { addNewVolunteer } = require('../controllers/volunteerController');
const router = express.Router();
const { auth } = require("../middleware/auth");

//router.get("/reset-password", auth, resetPassword);
router.post("/add-volunteer", auth, addNewVolunteer)

module.exports = router;
