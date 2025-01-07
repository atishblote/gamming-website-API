const { validationResult, check } = require('express-validator');
const express = require("express");
const router = express.Router();
const Comments = require("../controllers/commentsController");

const validateComment = [
    check('full_name').notEmpty().withMessage('Full name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('message').notEmpty().withMessage('Message is required'),
    check('post_id').notEmpty().withMessage('Post ID is required'),
    check('status').notEmpty().withMessage('Status is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  

router.get("/", Comments.getComments);

router.get("/:commentID", Comments.getSingleComments);

router.post("/",validateComment, Comments.postComments);

module.exports = router;
