const mongoose = require("mongoose");

const teamsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    team_name:{type: String,require:true},
    country_code:{type: String,require:true},
    logo:{type: String,require:true},
    image_id:{type:mongoose.Schema.ObjectId},
    details:{type: String,require:true}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teams", teamsSchema);
