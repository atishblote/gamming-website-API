const { validationResult, check } = require('express-validator');
const express = require('express')
const router = express.Router()
const User = require('../controllers/userController')

const validateSignUp = [
    check('username').notEmpty().withMessage('username is required'),
    check('email').isEmail().withMessage('email must be a valid'),
    check('first_name').notEmpty().withMessage('first name is required'),
    check('last_name').notEmpty().withMessage('last name is required'),
    check('number').isNumeric().withMessage('Number is required'),
    check('password').isStrongPassword().withMessage('password is not strong'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

router.post("/login", User.loginAdmin)
router.post("/signup", User.signupAdmin)
// router.post("/reset", Admin.signupAdmin)

module.exports = router;
