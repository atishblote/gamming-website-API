const mongoose = require("mongoose");

const liveMachesSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, require: true },
    featured_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Media",
    },
    alt_text: { type: String },
    link: { type: String, require: true },
    is_active: { type: Boolean, require: true, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Matches", liveMachesSchema);
