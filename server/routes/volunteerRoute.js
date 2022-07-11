const express = require("express");
const {
  addNewVolunteer,
  getAllVolunteer,
  getVolunteerData,
  editVolunteer,
  deleteVolunteerData,
  getCurrentVolunteer,
  volunteerCount,
} = require("../controllers/volunteerController");
const router = express.Router();
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");

router.post("/add-volunteer", auth, addNewVolunteer);
router.get("/volunteer-count", auth, volunteerCount);
router.get("/get-volunteers", auth, getAllVolunteer);
router.get("/get-current-volunteer", auth, getCurrentVolunteer);
router.get("/:id", auth, getVolunteerData);
router.post("/:id/edit", checkAdminAndMonitorRole, editVolunteer);
router.get("/:id/delete", auth, deleteVolunteerData);

module.exports = router;
