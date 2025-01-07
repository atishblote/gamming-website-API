const mongoose = require("mongoose");
const sharp = require("sharp");

const Media = require("../models/mediaModels");

exports.getMedia = async (req, res, next) => {
  try {
    const media = await Media.find();
    res.status(200).json({
      code: 1,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in media",
      error: error,
    });
  }
};

exports.postMedia = async (req, res, next) => {
  const smallPath = "uploads/small";
  const mediumPath = "uploads/medium";
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  try {
    const sharpSmallImg = await sharp(req.file.path)
      .resize({
        width: 150,
        height: 97,
      })
      .toFile(`${smallPath}/${uniqueSuffix}_${req.file.originalname}`);

    //   medium
    const sharpMediumImg = await sharp(req.file.path)
      .resize({
        width: 768,
        height: 515,
      })
      .toFile(`${mediumPath}/${uniqueSuffix}_${req.file.originalname}`);
    // console.log(sharpSmallImg)
    const mediaData = new Media({
      _id: new mongoose.Types.ObjectId(),
      name: req.file.originalname,
      small_media: `${smallPath}/${uniqueSuffix}_${req.file.originalname}`,
      media_media: `${mediumPath}/${uniqueSuffix}_${req.file.originalname}`,
      large_media: req.file.path,
      author_id: req.body.author_id,
      post_id: req.body.post_id,
      is_deleted: req.body.is_deleted,
    });

    const media = await mediaData.save();
    res.status(200).json({
      code: 1,
      message: "Media uploaded successfuly",
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in media",
      error: error,
    });
  }
};
