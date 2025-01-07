const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    title: { type: String, require: true },
    featured_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    slug: { type: String, require: true, unique:true },
    except: { type: String, require: true },
    description: { type: String },
    category_id: [
      { type: mongoose.Schema.Types.ObjectId, 
        ref: "Category" }
      ],
    tags: [
      { type: mongoose.Schema.Types.ObjectId, 
        ref: "tag" }
      ],
    status: { type: Boolean, default: false },
    author_id: {
      type: String, require: true
    },
    comment_status: { type: Boolean, default: false },
    date:{ type:String}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
