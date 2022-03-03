const express = require("express");
const { getListCV, getCVDataById } = require("../controllers/cvController");
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const router = express.Router();

router.post("/get-all-cv", checkAdminAndMonitorRole, getListCV);
router.post("/:id", checkAdminAndMonitorRole, getCVDataById);

module.exports = router;
