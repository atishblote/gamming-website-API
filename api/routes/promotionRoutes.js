const express = require("express");
const router = express.Router();

const Promotions = require("../controllers/promotionController");

router.get("/",  Promotions.allViewPromotion);

// router.get("/:fantacyID", Fantacy.blogSingleFantacy);

module.exports = router;
