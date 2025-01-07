const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Media = require("../models/mediaModels");

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dnagrjvtq',      // Replace with your Cloudinary cloud name
  api_key: '235185446162292',            // Replace with your Cloudinary API key
  api_secret: 'pHmxIMp1zBffZrwRlmQh6SIZTJs'       // Replace with your Cloudinary API secret
});

// Helper function to get session data
const getSessionData = (session) => ({
  _id: session.user_id,
  email: session.email,
  first_name: session.first_name,
  role: session.role,
  is_active: session.is_active,
});

// Fetch all media
exports.allMedias = async (req, res, next) => {
  try {
    const media = await Media.find();
    const userData = getSessionData(req.session);

    res.render("media/all-media", {
      data: media,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    console.error("Error fetching all media:", error);
    res.status(500).json({
      code: 0,
      message: "Something went wrong while fetching media.",
    });
  }
};

// Render add media form
exports.addMedias = async (req, res, next) => {
  try {
    const userData = getSessionData(req.session);

    res.render("media/add-media", {
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    console.error("Error rendering add media form:", error);
    res.render("media/add-media", {
      userData: getSessionData(req.session),
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// Upload and process a single media file using Cloudinary
exports.addSingleMedia = async (req, res, next) => {
  try {
    // console.log(req)
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "maxsports-uploads", 
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    });

    // Save media data to database
    const mediaData = new Media({
      _id: new mongoose.Types.ObjectId(),
      name: req.file.originalname,
      small_media: result.secure_url, // Small image URL from Cloudinary
      media_media: result.secure_url, // Medium image URL from Cloudinary
      large_media: result.secure_url, // Original image URL from Cloudinary
      author_id: req.body.author_id,
      post_id: req.body.post_id,
      is_deleted: req.body.is_deleted || false,
    });

    const savedMedia = await mediaData.save();
    const userData = getSessionData(req.session);

    res.render("media/add-media", {
      data: savedMedia,
      userData,
      code: 1,
      message: "Media uploaded successfully",
      currentRoute: req.path,
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.render("media/add-media", {
      code: 0,
      message: "Media upload failed",
      currentRoute: req.path,
    });
  }
};

// Delete single media
exports.deleteSingleMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.mediaID);

    if (!media) {
      return res.status(404).json({
        code: 0,
        message: "Media not found",
      });
    }

    // Delete from Cloudinary
    const publicId = media.large_media.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`media/${publicId}`);

    // Delete from database
    await Media.findByIdAndDelete(req.params.mediaID);

    res.status(200).json({
      code: 1,
      message: "Deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({
      code: 0,
      message: "Something went wrong!",
    });
  }
};



// const mongoose = require("mongoose");
// const sharp = require("sharp");

// const Media = require("../models/mediaModels");



// // all media
// exports.allMedias = async (req, res, next) => {
//     try {
//       const media = await Media.find();
//       const userData = {
//         _id: req.session.user_id,
//         email: req.session.email,
//         first_name: req.session.first_name,
//         role: req.session.role,
//         is_active: req.session.is_active,
//       };
  
//       res.render("media/all-media", {
//         data: media,
//         userData,
//         currentRoute: req.path,
//       });
//     } catch (error) {
//       res.status(500).json({
//         code: 0,
//         message: "Something went wrong in author",
//         error: error,
//       });
//     }
//   };

//   exports.addMedias = async (req, res, next) => {
//     try {
//       const userData = {
//         _id: req.session.user_id,
//         email: req.session.email,
//         first_name: req.session.first_name,
//         role: req.session.role,
//         is_active: req.session.is_active,
//       };
  
//       res.render("media/add-media", {
//         userData,
//         code: undefined,
//         message:"",
//         currentRoute: req.path,
//       });
//     } catch (error) {
//         res.render("media/add-media", {
//             userData,
//             code: undefined,
//             message:"Something went wrong",
//             currentRoute: req.path,
//           });
//     }
//   };
  
//   exports.addSingleMedia = async (req, res, next) => {
//     const smallPath = "uploads/small";
//     const mediumPath = "uploads/medium";
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     try {
//       const sharpSmallImg = await sharp(req.file.path)
//         .resize({
//           width: 150,
//           height: 97,
//         })
//         .toFile(`${smallPath}/${uniqueSuffix}_${req.file.originalname}`);
  
//       //   medium
//       const sharpMediumImg = await sharp(req.file.path)
//         .resize({
//           width: 768,
//           height: 515,
//         })
//         .toFile(`${mediumPath}/${uniqueSuffix}_${req.file.originalname}`);
//       // console.log(sharpSmallImg)
//       const mediaData = new Media({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.file.originalname,
//         small_media: `${smallPath}/${uniqueSuffix}_${req.file.originalname}`,
//         media_media: `${mediumPath}/${uniqueSuffix}_${req.file.originalname}`,
//         large_media: req.file.path,
//         author_id: req.body.author_id,
//         post_id: req.body.post_id,
//         is_deleted: req.body.is_deleted,
//       });
//       const userData = {
//         _id: req.session.user_id,
//         email: req.session.email,
//         first_name: req.session.first_name,
//         role: req.session.role,
//         is_active: req.session.is_active,
//       };


//       const media = await mediaData.save();
//       res.render("media/add-media", {
//         data: media,
//         userData,
//         code:1,
//         message: "Media uploaded successfuly",
//         currentRoute: req.path,
//       });
    
//     } catch (error) {
//         res.render("media/add-media", {
//             code:0,
//             message: "Media uploaded Falied",
//             currentRoute: req.path,
//           });
//     }
//   };

// // delete 
// exports.deleteSingleMedia = async(req, res, next) =>{
//   try {
//     const userData = {
//       _id: req.session.user_id,
//       email: req.session.email,
//       first_name: req.session.first_name,
//       role: req.session.role,
//       is_active: req.session.is_active,
//     };
//     const fantacy = await Media.findByIdAndDelete({_id: req.params.mediaID})

//     res.status(200).json({
//       code: 1,
//       message: "Deleted Successfuly !"
//     });

//   } catch (error) {
//     res.status(200).json({
//       code: 0,
//       message: "Someting went wrong!"
//     });
//   }
// }