const mongoose = require("mongoose");

const Blog = require("../models/blogsModel");
const Comments = require("../models/commentsModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModels");

exports.getSingleBlog = async (req, res, next) => {
  try {
    const comment = await Comments.find({ post_id: req.params.blogsID}); // Use $eq operator to match exact value
    const category = await Category.find({ post_id: req.params.blogsID}); // Use $eq operator to match exact value
    const tag = await Tag.find({ post_id: req.params.blogsID}); // Use $eq operator to match exact value
    const blog = await Blog.find({ _id: req.params.blogsID })
      .populate({
        path: "featured_id",
        select: "name large_media",
      })
      .populate({
        path: "author_id",
        select: "-password",
      })
      .populate({
        path: "category_id",
        select: "name slug",
      })
      .populate({
        path: "tags",
        select: "name",
      }); 

    // const category = await Category.findById(req.params.categoryID)
    if (blog.length > 0) {
      res.status(200).json({
        code: 1,
        data: blog,
        category: category,
        tags: tag,
        comments:comment,
        count:comment.length
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
      message: "Something went wrong in blog",
      error: error,
    });
  }
};

// view all listing blog

exports.getAllViewBlog = async (req, res, next) => {
  try {

      const blog = await Blog.find()
      .select('_id title slug date except')
      .populate({
      path: "featured_id",
      select: "name media_media status comment_count updatedAt",
    })
    .populate({
      path: "author_id",
      select: "first_name",
    })
    .populate({
      path: "category_id",
      select: "name",
    })
    .limit(5)
    .sort({ createdAt: -1 })
    
    // const category = await Category.findById(req.params.categoryID)
    if (blog.length > 0) {
      res.status(200).json({
        code: 1,
        data: blog,
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
      message: "Something went wrong in blog",
      error: error,
    });
  }
};
