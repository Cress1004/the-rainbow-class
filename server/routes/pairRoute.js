const express = require("express");
const { getLessonsByPair } = require("../controllers/pairsController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/:pairId/lessons", auth, getLessonsByPair);

module.exports = router;
