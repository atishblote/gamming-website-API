const mongoose = require("mongoose");
const cache = require('../../config/cache');

const Blog = require("../models/blogsModel");

exports.getBlog = async (req, res, next) => {
  const cacheKey = 'allBlogs';
  const limit = parseInt(req.query.limit) || 2;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    // If data is available in cache, return it
    return res.json({ data: cachedData, source: 'cache' });
  }

  try {
    const blog = await Blog.find()
      .limit(limit)
      .populate({
        path: "featured_id",
        select: "name small_media  media_media",
      })
      .populate({
        path: "category_id",
        select: "name slug",
      })
      .populate({
        path: "tags",
        select: "name",
      });

    if (blog.length > 0) {
      // Cache the result for future requests
      cache.set(cacheKey, blog, 86400); // Cache for 1 hour (3600 seconds)

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

exports.postBlog = async (req, res, next) => {
  try {
    const trimmedSlug = req.body.title.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");
    const blogData = new Blog({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      featured_id: req.body.featured_id,
      slug: slug,
      except: req.body.except,
      description: req.body.description,
      category_id: req.body.category_id,
      tags: req.body.tags,
      status: req.body.status,
      author_id: req.body.author_id,
      comment_status: req.body.comment_status,
      date:req.body.date,
    });

    const blog = await blogData.save();

    // Invalidate the cache since new blog has been added
    cache.del('allBlogs');

    res.status(200).json({
      code: 1,
      data: "Blog added successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in blog",
      error: error,
    });
  }
};

exports.getSingleBlog = async (req, res, next) => {
  const cacheKey = `singleBlog-${req.params.blogsID}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    // If data is available in cache, return it
    return res.json({ data: cachedData, source: 'cache' });
  }

  try {
    const blog = await Blog.find({ _id: req.params.blogsID })
      .populate({
        path: "featured_id"
      })
      .populate({
        path: "author_id",
        select: "-password",
      })
      .populate({
        path: "category_id"
      })
      .populate({
        path: "tags"
      })
      .populate({
        path: "comment_id"
      });

    if (blog.length > 0) {
      // Cache the result for future requests
      cache.set(cacheKey, blog, 3600); // Cache for 1 hour (3600 seconds)

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
