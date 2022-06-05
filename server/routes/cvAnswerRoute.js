const express = require("express");
const { getAnswerWithCV } = require("../controllers/cvAnswerController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/:id", auth, getAnswerWithCV);

module.exports = router;
