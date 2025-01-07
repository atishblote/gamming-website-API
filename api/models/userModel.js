const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, require: true },
    email: { type: String, require: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true },
    number: { type: Number, require: true },
    role: { type: String, require: true, default: "customer" },
    is_active: { type: String, require: true, default: 'false' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
