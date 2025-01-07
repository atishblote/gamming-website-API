const { validationResult, check } = require('express-validator');
const express = require("express");
const router = express.Router();
const Payment = require("../controllers/paymentController");

// const validatePostCategory = [
//     check('name').notEmpty().withMessage('Name is required'),
//     check('post_id').notEmpty().withMessage('post id is required'),
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     },
//   ];

//   router.get("/", Payment.createOrder);

router.post('/', Payment.createOrder);
  
module.exports = router;