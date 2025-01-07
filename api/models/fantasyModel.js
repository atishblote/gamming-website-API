const mongoose = require("mongoose");

const fantasySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name:{type: String, require: true},
    banner_image:{type: String, require: true},
    team_one:
        { type: mongoose.Schema.Types.ObjectId, 
          ref: "Teams" }
        ,
    team_two:
        { type: mongoose.Schema.Types.ObjectId, 
          ref: "Teams" }
        ,
    date_time:{type: String, require: true},
    time_stam:{type: String},
    venues:{type: String, require: true},
    attached_package:[
        { type: mongoose.Schema.Types.ObjectId, 
          ref: "Package" }
        ],
    rapid_match_id:{type: Number, require: true},
    is_active: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fantacy", fantasySchema);
