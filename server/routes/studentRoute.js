const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { addNewStudent, getStudents } = require("../controllers/studentController");

router.post("/add-student", auth, addNewStudent);
router.post("/get-students", auth, getStudents);

module.exports = router;
