const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, require: true ,default: "Author"},
  is_active: { type: Boolean, require: true, default: false},
},{
    timestamps:true
}
);

module.exports = mongoose.model("Author", authorSchema);
