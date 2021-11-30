const express = require('express');
const { addClass, getClasses, getClassData } = require('../controllers/classController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/add-class", auth, addClass);
router.post("/get-classes", auth, getClasses);
router.post("/:id", auth, getClassData);

module.exports = router;
