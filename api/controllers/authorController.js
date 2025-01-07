const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Author = require('../models/authorModel')

// get author
exports.getAuthor = async(req,res,next) => {
    try {
        const author = await Author.find()
        if(author.length > 0){
            res.status(200).json({
                code: 1,
                data: author
            })
        }else{
            res.status(204).json({
                code: 0,
                message: "No data found"
            })
        }
    } catch (error) {
        res.status(500).json({
            code: 0,
            message: "Something went wrong in author",
            error: error
        })
    }
}


//post author
exports.postAuthor = async(req,res,next) => {
    try {
        const author = await Author.find({email:req.body.email});
        //console.log(author)
        if(author.length <= 0 || author == null){
            bcrypt.hash(req.body.password, 10 , (err,hash)=>{
                if(err){
                    res.status(401).json({
                        error: err
                    })
                }else{
                    const  authorData = new Author({
                        _id: new mongoose.Types.ObjectId(),
                        first_name: req.body.first_name,
                        email: req.body.email,
                        password: hash,
                        role: req.body.role,
                        is_active: req.body.is_active,
                    })
                    const author = authorData.save();
                    res.status(200).json({
                        code: 1,
                        message: "Author created successfuly"
                    })
                }
            })
        }else{
            res.status(401).json({
                code: 0,
                message: "Author already exits"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            code: 0,
            message: "Something went wrong",
            error: error
        })
    }
}


//GET single blog
exports.getSingleAuthor = async(req,res,next) => {
    try {
        const author = await Author.findById({_id: req.params.authorID})
        res.status(200).json({
            code: 1,
            data:author
        })
    } catch (error) {
        res.status(500).json({
            code: 0,
            message: "Something went wrong in author",
            error: error
        })
    }
}