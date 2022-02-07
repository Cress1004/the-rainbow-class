const express = require("express");
const { updatePersonInChargeToSchedule } = require("../controllers/scheduleController");
const { checkAdminAndMonitorRole } = require("../middleware/auth");
const router = express.Router();

router.post("/:scheduleId/update-person-incharge", checkAdminAndMonitorRole, updatePersonInChargeToSchedule);

module.exports = router;
