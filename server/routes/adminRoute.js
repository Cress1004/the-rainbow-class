const express = require("express");
const { getAllAdmin } = require("../controllers/adminController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/get-admin", auth, getAllAdmin);

module.exports = router;
