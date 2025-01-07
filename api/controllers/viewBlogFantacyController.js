// all fantacy
const Fantacy = require("../models/fantasyModel");

exports.blogSingleFantacy = async (req, res, next) => {
  try {
    const fantacy = await Fantacy.find({ _id: req.params.fantacyID })
      .populate({
        path: "team_one",
        select: "team_name country_code logo"
      })
      .populate({
        path: "team_two",
        select: "team_name country_code logo"
      })
      .populate({
        path: "attached_package"
      })

    //   console.log(reveFantacy)
    // const fantacy = reveFantacy.reverse()

    if (fantacy.length > 0) {
      res.status(200).json({
        code: true,
        data: fantacy,
        message:''
      });
    } else {
      res.status(401).json({
        code: false,
        message: "Data not found",
      });
    }
  } catch (error) {}
};
