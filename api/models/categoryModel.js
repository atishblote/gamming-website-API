const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{type:String,require: true,unique:true},
    slug:{type:String,require: true}
},{
    timestamps:true
})

module.exports = mongoose.model("Category",categorySchema)