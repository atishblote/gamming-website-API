const express = require("express");
const router = express.Router();
const Fantacy = require("../controllers/fantacyController");


router.get("/", Fantacy.allFantacy);

router.get("/:fantacyID", Fantacy.getSingleFantacy);

module.exports = router;