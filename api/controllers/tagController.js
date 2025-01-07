const mongoose = require("mongoose");

const Tags = require("../models/tagModels");
const { body } = require("express-validator");

exports.geTags = async (req, res, next) => {
  try {
    const tag = await Tags.find();
    //console.log(tag);
    if (tag.length > 0) {
      res.status(200).json({
        code: 1,
        data: tag,
      });
    } else {
      res.status(401).json({
        code: 0,
        message: "Data not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in tags",
      error: error,
    });
  }
};

exports.postTags = async (req, res, next) => {
  try {
    const trimmedSlug = req.body.name.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");
    const tagData = new Tags({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      slug: slug,
    });

    const tag = await tagData.save();
    res.status(200).json({
      code: 1,
      message: "Tag added successfuly",
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in tag",
      error: error,
    });
  }
};

exports.getSingleTag = async (req, res, next) => {
  try {
    const tag = await Tags.findById(req.params.tagID);
    if (tag != null) {
      res.status(200).json({
        code: 1,
        data: tag,
      });
    } else {
      res.status(401).json({
        code: 0,
        message: "No record found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in tags",
      error: error,
    });
  }
};
