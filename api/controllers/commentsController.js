const mongoose = require("mongoose");
const Comments = require("../models/commentsModel");


// get all comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comments.find();
    // const count =  await Comments.countDocuments({age:{$gte:5}});
    
    if (comments.length > 0) {
      res.status(200).json({
        code: 1,
        data: comments,
      });
    } else {
      res.status(204).json({
        code: 0,
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in comment",
      error: error,
    });
  }
};

// Post comment
exports.postComments = async (req, res, next) => {
    const {full_name,email,message,post_id,status} = req.body
  try {
    const commentData = new Comments({
      _id: new mongoose.Types.ObjectId(),
      full_name: req.body.full_name,
      email: req.body.email,
      message: req.body.message,
      post_id: req.body.post_id,
      status: req.body.status,
    });

    const comment = commentData.save();
    res.status(200).json({
      code: 1,
      message: "Comment added successfuly",
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in comment",
      error: error,
    });
  }
};


// get single comments
exports.getSingleComments = async (req, res, next) => {
  try {
    const comments = await Comments.find({ _id: req.params.commentID });
    const count = await Comments.countDocuments({ post_id: "65210d29f6f13d6772a1ca6c"}); // Use $eq operator to match exact value
      
    if (comments.length > 0) {
      res.status(200).json({
        code: 1,
        data: comments,
        count: count
      });
    } else {
      res.status(204).json({
        code: 0,
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in comment",
      error: error,
    });
  }
};
