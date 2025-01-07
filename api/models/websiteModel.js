const mongoose = require("mongoose");

const websitesSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name:{type: String, require: true},
    logo_url:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
    },
    slug:{type: String, require: true, unique: true},
    rating:{type: Number},
    price:{type: Number, require: true},
    button_link:{type: String, require: true},
    is_active: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Websites", websitesSchema);
