const express = require("express");
const router = express.Router();

const Fantacy = require("../controllers/viewBlogFantacyController");

// router.get("/", Blog.getAllViewBlog);

router.get("/:fantacyID", Fantacy.blogSingleFantacy);

module.exports = router;
