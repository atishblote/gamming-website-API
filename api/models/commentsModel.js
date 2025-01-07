const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  post_id: { type: mongoose.Schema.Types.ObjectId, require: true },
  full_name: { type: String, require: true, default: "Unknown" },
  email: { type: String, require: true },
  message: { type: String },
  status: { type: String, require: true, default: "draft" },
}
,{
    timestamps:true
});

module.exports = mongoose.model("Comments", commentSchema);