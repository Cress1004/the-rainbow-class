const express = require("express");
const { getListCV } = require("../controllers/cvController");
const { auth, checkAdminAndMonitorRole } = require("../middleware/auth");
const router = express.Router();

router.post("/get-all-cv", checkAdminAndMonitorRole, getListCV);

module.exports = router;
