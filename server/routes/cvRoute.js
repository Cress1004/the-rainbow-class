const express = require("express");
const { getListCV, getCVDataById, updateCVStatus } = require("../controllers/cvController");
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const router = express.Router();

router.get("/get-all-cv", checkAdminAndMonitorRole, getListCV);
router.get("/:id", checkAdminAndMonitorRole, getCVDataById);
router.post("/:id/update-status", checkAdminAndMonitorRole, updateCVStatus);

module.exports = router;
