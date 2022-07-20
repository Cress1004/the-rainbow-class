const express = require("express");
const { getLessonsByPair, getPairData } = require("../controllers/pairsController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/:pairId/lessons", auth, getLessonsByPair);
router.get("/:pairId", auth, getPairData);

module.exports = router;
