const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, require: true },
    email: { type: String, require: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true, default: "unknown" },
    is_active: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
