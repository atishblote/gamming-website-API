const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  small_media: { type: String, require: true },
  media_media: { type: String, require: true },
  large_media: { type: String, require: true },
  author_id: { type: mongoose.Schema.ObjectId },
  post_id: { type: mongoose.Schema.ObjectId },
  is_deleted: { type: Boolean, require: true , default: false},
},{
    timestamps:true
})
module.exports = mongoose.model("Media", mediaSchema);
