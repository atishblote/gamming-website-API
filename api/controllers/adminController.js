const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const util = require("util");

const hashAsync = util.promisify(bcrypt.hash);

exports.signupAdmin = async (req, res, next) => {
  try {
    // Validate request body parameters here

    const checkAdmin = await Admin.findOne({ email: req.body.email });

    if (!checkAdmin) {
      const hash = await hashAsync(req.body.password, 10);

      const adminData = new Admin({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hash,
        role: req.body.role,
        is_active: req.body.is_active,
      });

      const admin = await adminData.save();

      res.status(200).json({
        code: 1,
        message: "Admin created successfully",
      });
    } else {
      res.status(401).json({
        code: 0,
        message: "Admin already exists",
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
    const admin = await Admin.findOne({ email: req.body.email });
    
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    if (!admin.is_active) {
      return res.status(401).json({
        code: 0,
        message: "Account not activated",
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
          expiresIn: "12h",
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
