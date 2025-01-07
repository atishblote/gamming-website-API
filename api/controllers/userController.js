const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const util = require("util");

const hashAsync = util.promisify(bcrypt.hash);

exports.signupAdmin = async (req, res, next) => {
  try {
    // Validate request body parameters here
    // console.log("try")
    const checkAdmin = await User.findOne({ email: req.body.email, username: req.body.username });
    console.log(checkAdmin)
    console.log(req.body)
    if (checkAdmin == null) {
      const hash = await hashAsync(req.body.password, 10);

      const userData = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hash,
        number: req.body.number,
        role: req.body.role,
        is_active: req.body.is_active,
      });

      const admin = await userData.save();

      res.status(200).json({
        code: 1,
        message: "User created successfully",
      });
    } else {
      res.status(401).json({
        code: 0,
        message: "User already exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};


exports.loginAdmin = async (req, res, next) => {
  try {
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!admin.is_active) {
      return res.status(401).json({
        code: 0,
        message: "Account is deactivate",
      });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, admin.password);
    
    if (passwordMatch) {
      const token = jwt.sign(
        {
          email: admin.email,
          id: admin._id,
        },
        "9R#7m3PqKz",
        {
          expiresIn: "2h",
        }
      );

      res.status(200).json({
        code: 1,
        message: "Auth successfully",
        token: token,
        username: admin.username,
        first_name: admin.first_name,
        role: admin.role,
        email: admin.email,
        number: admin.number,
      });
    } else {
      res.status(404).json({
        message: "Password wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong",
      error: error,
    });
  }
};
