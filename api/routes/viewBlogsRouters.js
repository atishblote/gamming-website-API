const express = require("express");
const router = express.Router();

const Blog = require("../controllers/viewBlogsController");

router.get("/", Blog.getAllViewBlog);

router.get("/:blogsID", Blog.getSingleBlog);


module.exports = router;
