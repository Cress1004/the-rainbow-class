const express = require('express');
const { addClass, getClasses, getClassData, deleteClassData, editClassData } = require('../controllers/classController');
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/add-class", auth, addClass);
router.post("/get-classes", auth, getClasses);
router.post("/:id", auth, getClassData);
router.post("/:id/delete", auth, deleteClassData);
router.post("/:id/edit", auth, editClassData);

module.exports = router;
