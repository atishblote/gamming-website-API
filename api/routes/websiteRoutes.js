const express = require("express");
const router = express.Router();

const Websites = require("../controllers/websiteController");

router.get("/",  Websites.allwebsites);

// router.get("/:fantacyID", Fantacy.blogSingleFantacy);

module.exports = router;
