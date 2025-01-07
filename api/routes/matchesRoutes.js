const express = require("express");
const router = express.Router();

const Matches = require("../controllers/matchesController");

router.get("/",  Matches.allViewMatches);

// router.get("/:fantacyID", Fantacy.blogSingleFantacy);

module.exports = router;
