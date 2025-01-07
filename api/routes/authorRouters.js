const express = require("express");
const router = express.Router();
const Author = require("../controllers/authorController");

router.get("/", Author.getAuthor);
router.get("/:authorID", Author.getSingleAuthor);
router.post("/", Author.postAuthor);

module.exports = router;
