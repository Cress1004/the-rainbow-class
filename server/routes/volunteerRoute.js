const express = require("express");
const { addNewVolunteer, getAllVolunteer, getVolunteerData, editVolunteer, deleteVolunteerData } = require("../controllers/volunteerController");
const router = express.Router();
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");

router.post("/add-volunteer", auth, addNewVolunteer);
router.post("/get-volunteers", auth, getAllVolunteer);
router.post("/:id", auth, getVolunteerData);
router.post("/:id/edit", checkAdminAndMonitorRole, editVolunteer);
router.post("/:id/delete", auth, deleteVolunteerData)

module.exports = router;
