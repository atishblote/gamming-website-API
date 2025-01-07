// const { validationResult, check } = require('express-validator');
const express = require("express");
const router = express.Router();

// const validatePost = [
//     check('title').notEmpty().withMessage('title is required'),
//     check('except').notEmpty().withMessage('except is required'),
//     check('category_id').notEmpty().withMessage('category is required'),
//     check('status').isBoolean().withMessage('blog status is true or false'),
//     check('author_id').notEmpty().withMessage('author is required'),
//     check('comment_status').isBoolean().withMessage('comment status is true or false'),
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     },
//   ];

const Blog = require("../controllers/blogController");

router.get("/", Blog.getBlog);

router.get("/:blogsID", Blog.getSingleBlog);
// user view
// router.get("/all", Blog.getAllViewBlog);

// router.post("/", Blog.postBlog);

module.exports = router;
