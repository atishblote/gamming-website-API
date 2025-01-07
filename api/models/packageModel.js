const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  price: { type: Number, require: true },
  discounted_price: { type: Number},
  offer: { type: String},
  services: { type: String},
  button_link: { type: String},
  pack_color: { type: String},
  is_prime: {type: Boolean, require: true, default: false},
  is_active: { type: Boolean, require: true, default: false},
},{
    timestamps:true
}
);

module.exports = mongoose.model("Package", packageSchema);
