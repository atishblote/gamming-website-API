const { validationResult, check } = require('express-validator');
const express = require("express");
const router = express.Router();
const Category = require("../controllers/categoryController");


const validatePostCategory = [
    check('name').notEmpty().withMessage('Name is required'),
    check('post_id').notEmpty().withMessage('post id is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  

router.get("/", Category.getCategory);

router.get("/:categoryID", Category.getSingleCategory);

router.post("/",validatePostCategory, Category.postCategory);

module.exports = router;