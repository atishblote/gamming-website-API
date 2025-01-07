const mongoose = require('mongoose')
const Category = require('../models/categoryModel')

// get all category
exports.getCategory = async(req,res,next) => {
    try {
        const category = await Category.find();
        if(category.length > 0){
            res.status(200).json({
                code: 1,
                data: category
            })
        }else{
            res.status(401).json({
                code: 0,
                message: "Data not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            code: 0,
            message: "Something went wrong in category",
            error: error,
          });
    }
}

// POST category
exports.postCategory = async (req, res, next) => {  
    try {
      const trimmedSlug = req.body.name.trim().toLowerCase();
      const slug = trimmedSlug.replace(/\s+/g, "-");
      const categoryData = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        media:req.body.media,
        slug: slug,
      });

      const category = await categoryData.save();
      res.status(200).json({
        code: 1,
        message: `Category added successfuly`,
      });
    } catch (error) {
      res.status(500).json({
        code: 0,
        message: `${req.body.name} category already exits`,
        error: error,
      });
    }
};

// get single category
exports.getSingleCategory = async (req,res,next) => {
  try {
    const category = await Category.findById(req.params.categoryID)
    console.log(category.length)
    if(category === null){
      res.status(204).json({
        code: 0,
        message:"Category not found"
      })
    }else{
      res.status(200).json({
        code: 1,
        data: category
      })
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in category",
      error: error,
    });
  }
}