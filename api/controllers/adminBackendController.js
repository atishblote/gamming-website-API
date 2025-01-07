const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Admin = require("../models/adminModel");
const Teams = require("../models/teamsModel");
const Media = require("../models/mediaModels");
const Package = require("../models/packageModel");
const Fantacy = require("../models/fantasyModel");
const Websites = require("../models/websiteModel");
const Matches = require("../models/liveMaches");
const Promotions = require("../models/promotionModel");
const Blog = require("../models/blogsModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModels");
const Author = require("../models/authorModel");
const User = require("../models/userModel");
const util = require("util");
// const { response } = require("../routes/adminBackendRoutes");

const hashAsync = util.promisify(bcrypt.hash);

exports.admnLogin = async (req, res, next) => {
  try {
    res.render("login", { message: "" });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

exports.checkAdmnLogin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    console.log(admin);

    // If admin is null, render the login page and stop further execution
    if (admin == null) {
      return res.render("login", { message: "Email not Found" });
    }

    // If admin is not active, render the login page and stop further execution
    if (!admin.is_active) {
      return res.render("login", { message: "Email not active" });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(req.body.password, admin.password);

    if (!passwordMatch) {
      // If password is incorrect, render the login page and stop further execution
      return res.render("login", { message: "Password wrong" });
    }

    // Set session variables if login is successful
    req.session.user_id = admin._id;
    req.session.is_active = admin.is_active;
    req.session.email = admin.email;
    req.session.first_name = admin.first_name;
    req.session.role = admin.role;

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    // Render the dashboard if login is successful
    return res.render("dashboard", { userData, currentRoute: req.path });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error.message,
    });
  }
};


// dashboard

exports.showDashboard = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("dashboard", { userData, currentRoute: req.path });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// Teams
exports.allTeams = async (req, res, next) => {
  try {
    const teams = await Teams.find();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("teams/all-teams", {
      userData: userData,
      data: teams,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

exports.addTeams = async (req, res, next) => {
  try {
    const media = await Media.find();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("teams/add-teams", {
      data: media,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("teams/add-teams", {
      code: 0,
      userData: undefined,
      data: undefined,
      message: "Something went wrong in author",
    });
  }
};

exports.addNewTeams = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const teamData = new Teams({
      _id: new mongoose.Types.ObjectId(),
      team_name: req.body.team_name,
      country_code: req.body.country_code,
      logo: req.body.logo,
      image_id: req.body.image_id,
      details: req.body.details,
    });
    console.log(req.body);

    const data = await teamData.save();
    console.log(data);
    const media = await Media.find();
    res.render("teams/all-teams", {
      userData,
      data: media,
      code: 1,
      message: "Team Added Successfuly",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("teams/add-teams", {
      userData: undefined,
      data: undefined,
      code: 0,
      message: "Duplicate entry or server error",
      currentRoute: req.path,
    });
    res.redirect("teams/all-teams");
  }
};

// delete team
exports.deletSingleTeams = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const teamDel = await Teams.findByIdAndDelete({ _id: req.params.teamID });

    res.status(200).json({
      code: 1,
      message: "Deleted Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};
// update team
exports.updateSingleTeams = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamDel = await Teams.findByIdAndDelete({ _id: req.params.updateID });

    res.status(200).json({
      code: 1,
      message: "Update Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// All update team
// exports.allUpdateSingleTeams = async (req, res, next) => {
//   try {
//     console.log(req.params.singleId)
//     const teams = await Teams.findById({ _id: req.params.singleId });
//     const media = await Media.find();
//     console.log(teams)

//     const userData = {
//       _id: req.session.user_id,
//       email: req.session.email,
//       first_name: req.session.first_name,
//       role: req.session.role,
//       is_active: req.session.is_active,
//     };
//     res.render("teams/all-update-teams", {
//       userData: userData,
//       data: teams,
//       data1: media,
//       code: undefined,
//       message: "",
//       currentRoute: req.path,
//     });
//   } catch (error) {
//     res.status(500).json({
//       code: 0,
//       message: "Something went wrong in author",
//       error: error,
//     });
//   }
// };
// All update team
exports.getUpdateSingleTeamsId = async (req, res, next) => {
  try {
    console.log(req.params.singleId);
    console.log(req.query.page);
    console.log("get request");
    const teams = await Teams.findById({ _id: req.params.singleId });
    const media = await Media.find();
    console.log(teams);
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    res.render("teams/all-update-teams", {
      userData: userData,
      data: teams,
      data1: media,
      code: undefined,
      message: "",
      currentRoute: "/all-teams",
    });
    // res.redirect(`../all-update-teams/${req.params.singleId}`)
    // next()
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// update all data
exports.postUpdateSingleTeams = async (req, res, next) => {
  try {
    console.log(req.params.teamID);
    // console.log(req.body)
    console.log("post request");

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const updatedDocument = await Teams.findOneAndUpdate(
      { _id: req.params.teamID },
      {
        $set: {
          team_name: req.body.team_name,
          country_code: req.body.country_code,
          logo: req.body.logo,
          image_id: req.body.image_id,
          details: req.body.details,
        },
      },
      { new: true }
    );
    const teams = await Teams.findById({ _id: req.params.teamID });
    const media = await Media.find();
    if (!updatedDocument) {
      res.render("teams/all-update-teams", {
        userData: userData,
        data: teams,
        data1: media,
        code: 0,
        message: "Not updated !",
        currentRoute: "/all-teams",
      });
    } else {
      res.render("teams/all-update-teams", {
        userData: userData,
        data: teams,
        data1: media,
        code: 1,
        message: "Update Successfuly",
        currentRoute: "/all-teams",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// all packages
exports.allPackages = async (req, res, next) => {
  try {
    const package = await Package.find();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("package/all-packages", {
      userData: userData,
      data: package,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

exports.addPackage = async (req, res, next) => {
  try {
    const package = await Package.find();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    res.render("package/add-package", {
      data: package,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("package/add-package", {
      code: 0,
      userData: undefined,
      data: undefined,
      message: "Something went wrong in author",
    });
  }
};

exports.addNewPackage = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const packageData = new Package({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      discounted_price: req.body.discounted_price,
      offer: req.body.offer,
      services: req.body.services,
      button_link: req.body.button_link,
      pack_color: req.body.pack_color,
      is_prime: req.body.is_prime,
      button_link: req.body.button_link,
    });

    const package = await packageData.save();
    res.render("package/all-packages", {
      userData,
      data: undefined,
      code: 1,
      message: "Package Added Successfuly",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("package/all-packages", {
      userData: undefined,
      data: undefined,
      code: 0,
      message: "Duplicate entry or server error",
      currentRoute: req.path,
    });
  }
};

// delete
exports.deleteSinglePackage = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const fantacy = await Package.findByIdAndDelete({ _id: req.params.packID });

    res.status(200).json({
      code: 1,
      message: "Deleted Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};
// Update package
exports.updateSinglePackage = async (req, res, next) => {
  try {
    console.log(req.body);
    const updatedDocument = await Package.findOneAndUpdate(
      { _id: req.params.updateID }, // Query to find the document by its ID
      { $set: { is_active: req.body.is_active } }, // Update the property you want to modify
      { new: true } // Return the updated document instead of the old one
    );
    if (!updatedDocument) {
      return res.status(404).json({ code: 0, message: "Document not found" });
    }
    res.status(200).json({
      code: 1,
      message: "Update Successfuly!",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// All update fantacy
exports.getSinglePackages = async (req, res, next) => {
  try {
    const package = await Package.findById({ _id: req.params.singleId });
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    console.log(package);
    res.render("package/all-update-packages", {
      userData: userData,
      data: package,
      code: undefined,
      message: "",
      currentRoute: "/all-packages",
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// update all data
exports.postUpdatePackages = async (req, res, next) => {
  try {
    console.log(req.params.teamID);
    // console.log(req.body)
    console.log("post request");
    console.log(req.body);

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const updatedDocument = await Package.findOneAndUpdate(
      { _id: req.params.teamID },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          discounted_price: req.body.discounted_price,
          offer: req.body.offer,
          services: req.body.services,
          button_link: req.body.button_link,
          pack_color: req.body.pack_color,
          is_prime: req.body.is_prime,
          is_prime: req.body.is_prime,
          button_link: req.body.button_link,
        },
      },
      { new: true }
    );
    // const teams = await Teams.findById({ _id: req.params.teamID });
    // const media = await Media.find();
    console.log(updatedDocument);
    if (!updatedDocument) {
      res.redirect(
        `/all-update-packages/${req.params.teamID}?code=1?message=Update Successfuly ! `
      );
    } else {
      res.redirect("/all-packages");
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// all fantacy
exports.allFantacy = async (req, res, next) => {
  try {
    const reveFantacy = await Fantacy.find()
      .populate({
        path: "team_one",
      })
      .populate({
        path: "team_two",
      })
      .populate("attached_package");

    console.log(reveFantacy);
    // const fantacy = reveFantacy.reverse()
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("fantacy/all-fantacy", {
      data: reveFantacy,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("fantacy/all-fantacy", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.addFantacy = async (req, res, next) => {
  const options = {
    method: "GET",
    url: "https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/international",
    headers: {
      "X-RapidAPI-Key": "ec0dfbdc2emsh7d6339df5b5a91dp149b68jsnf1e0e44cc745",
      "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
    },
  };
  try {
    const teams = await Teams.find();
    const mediaReverce = await Media.find();
    const package = await Package.find();
    const response = await axios.request(options);
    console.log(response.data);
    const media = mediaReverce.reverse();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("fantacy/add-fantacy", {
      userData,
      data: teams,
      data1: media,
      data2: package,
      data3: response.data.matchScheduleMap,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("fantacy/all-fantacy", {
      userData: undefined,
      data: undefined,
      code: 0,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.addNewFantacy = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const inputDateTime = req.body.date_time;
    const date = new Date(inputDateTime);
    const formattedDateTime = moment(date).format("D MMMM YYYY h:mm A");

    const fantacyData = new Fantacy({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      banner_image: req.body.banner_image,
      team_one: req.body.team_one,
      team_two: req.body.team_two,
      date_time: formattedDateTime,
      venues: req.body.venues,
      time_stam: req.body.date_time,
      attached_package: req.body.attached_package,
      rapid_match_id: req.body.rapid_match_id,
      is_active: req.body.is_active,
    });
    // console.log(fantacyData)
    const fantacy = await fantacyData.save();
    res.render("fantacy/all-fantacy", {
      data: undefined,
      userData,
      code: 1,
      message: "Match added successfuly",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("fantacy/all-fantacy", {
      data: undefined,
      userData: undefined,
      code: 0,
      message: "Match added Falied or dublicate entry",
      currentRoute: req.path,
    });
  }
};

// delete
exports.deleteSingleFantacy = async (req, res, next) => {
  try {
    const fantacy = await Fantacy.findByIdAndDelete({
      _id: req.params.fantacyID,
    });

    res.status(200).json({
      code: 1,
      message: "Deleted Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// Update Fantacy
exports.updateSingleFantacy = async (req, res, next) => {
  try {
    console.log(req.body);
    const updatedDocument = await Fantacy.findOneAndUpdate(
      { _id: req.params.updateID }, // Query to find the document by its ID
      { $set: { is_active: req.body.is_active } }, // Update the property you want to modify
      { new: true } // Return the updated document instead of the old one
    );
    if (!updatedDocument) {
      return res.status(404).json({ code: 0, message: "Document not found" });
    }
    res.status(200).json({
      code: 1,
      message: "Update Successfuly!",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// All update fantacy
exports.getSingleFantacy = async (req, res, next) => {
  const options = {
    method: "GET",
    url: "https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/international",
    headers: {
      "X-RapidAPI-Key": "ec0dfbdc2emsh7d6339df5b5a91dp149b68jsnf1e0e44cc745",
      "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
    },
  };

  try {
    const teams = await Fantacy.findById({ _id: req.params.singleId })
      .populate({
        path: "team_one",
      })
      .populate({
        path: "team_two",
      })
      .populate("attached_package");
    const allteams = await Teams.find();
    const mediaReverce = await Media.find();
    const package = await Package.find();
    const response = await axios.request(options);
    console.log(response.data);
    console.log(teams);
    const media = mediaReverce.reverse();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("fantacy/all-update-fantacy", {
      userData,
      data: teams,
      data1: media,
      data2: package,
      data3: response.data.matchScheduleMap,
      data4: allteams,
      code: undefined,
      message: "",
      currentRoute: "/all-fantacy",
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// update all data
exports.postUpdateSingleFantacy = async (req, res, next) => {
  try {
    console.log(req.params.teamID);
    // console.log(req.body)
    console.log("post request");

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const inputDateTime = req.body.date_time;
    const date = new Date(inputDateTime);
    const formattedDateTime = moment(date).format("D MMMM YYYY h:mm A");

    const updatedDocument = await Fantacy.findOneAndUpdate(
      { _id: req.params.teamID },
      {
        $set: {
          name: req.body.name,
          banner_image: req.body.banner_image,
          team_one: req.body.team_one,
          team_two: req.body.team_two,
          date_time: formattedDateTime,
          venues: req.body.venues,
          time_stam: req.body.date_time,
          attached_package: req.body.attached_package,
          rapid_match_id: req.body.rapid_match_id,
          is_active: req.body.is_active,
        },
      },
      { new: true }
    );
    // const teams = await Teams.findById({ _id: req.params.teamID });
    // const media = await Media.find();
    console.log(updatedDocument);
    if (!updatedDocument) {
      res.redirect(
        `/all-update-fantacy/${req.params.teamID}?code=1?message=Update Successfuly ! `
      );
    } else {
      res.redirect("/all-fantacy");
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// all Prediction
exports.allPrediction = async (req, res, next) => {
  try {
    const revePrediction = await Blog.find()
      .populate({
        path: "featured_id",
        select: "name small_media large_media",
      })
      .populate({
        path: "category_id",
        select: "name slug",
      })
      .populate({
        path: "tags",
        select: "name",
      });

    // console.log(revePrediction);
    const blog = revePrediction.reverse();
    console.log(blog)
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    // res.status(200).json({
    //   data: blog
    // })
    res.render("prediction/all-prediction", {
      data: blog,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("prediction/all-prediction", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.addPrediction = async (req, res, next) => {
  try {
    const category = await Category.find();
    const tag = await Tag.find();
    const author = await Author.find();
    const revemedia = await Media.find();
    const revefantacy = await Fantacy.find();
    const media = revemedia.reverse();
    const fantacy = revefantacy.reverse();
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("prediction/add-prediction", {
      userData,
      data: undefined,
      dataCat: category,
      dataTag: tag,
      dataAuth: author,
      dataMedia: media,
      dataFantacy: fantacy,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
    
  } catch (error) {
    res.render("prediction/all-prediction", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.addSinglePrediction = async (req, res, next) => {
  try {
    console.log(req.body);
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const formattedDateTime = moment(req.body.date).format("D MMMM YYYY h:mm A");
    const trimmedSlug = req.body.title.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");

    const comment_status = req.body.comment_status == 'true' ? true : false
    const predictionData = new Blog({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      featured_id: req.body.featured_id,
      slug: slug,
      except: req.body.except,
      description: req.body.description,
      category_id: req.body.category_id,
      tags: req.body.tags,
      status: true,
      author_id: req.body.author_id,
      comment_status: comment_status,
      date: formattedDateTime,
    });
    const predictions = await predictionData.save();
    // console.log(predictions)
    
    res.redirect("/backend/all-blog");
  } catch (error) {
    res.render("prediction/all-prediction", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// delete
exports.deleteSinglePrediction = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const fantacy = await Blog.findByIdAndDelete({ _id: req.params.predID });

    res.status(200).json({
      code: 1,
      message: "Deleted Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// Update predication
exports.updateSinglePrediction = async (req, res, next) => {
  try {
    const updatedDocument = await Blog.findOneAndUpdate(
      { _id: req.params.updateID }, // Query to find the document by its ID
      { $set: { status: req.body.status } }, // Update the property you want to modify
      { new: true } // Return the updated document instead of the old one
    );
    if (!updatedDocument) {
      return res.status(404).json({ code: 0, message: "Document not found" });
    }
    res.status(200).json({
      code: 1,
      message: "Update Successfuly!",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};

// All update predication
exports.getSinglepPrediction = async (req, res, next) => {
  // const teams = await Fantacy.findById({ _id: req.params.singleId })
  try {
    const category = await Category.find();
    const tag = await Tag.find();
    const author = await Author.find();
    const revemedia = await Media.find();
    const revefantacy = await Fantacy.find();
    const media = revemedia.reverse();
    const fantacy = revefantacy.reverse();

    const revePrediction = await Blog.findById({ _id: req.params.singleId })
    .populate({
      path: "featured_id",
      select: "_id name small_media large_media",
    })
    .populate({
      path: "author_id",
      select: "-password",
    })
    .populate({
      path: "category_id",
      select: "_id name slug",
    })
    .populate({
      path: "tags",
      select: "_id name",
    });

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    console.log(revePrediction)
    res.render("prediction/all-update-prediction", {
      userData,
      data: revePrediction,
      dataCat: category,
      dataTag: tag,
      dataAuth: author,
      dataMedia: media,
      dataFantacy: fantacy,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};

// predication update all data
exports.postUpdateSinglePrediction = async (req, res, next) => {
  try {
    console.log(req.params.teamID);
    // console.log(req.body)
    console.log("post request");

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const date = new Date();
    const formattedDateTime = moment(date).format("D MMMM YYYY h:mm A");
    const trimmedSlug = req.body.title.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");
    const comment_id = ["65213465b9d24ff9e340d95d"];

    const updatedDocument = await Blog.findOneAndUpdate(
      { _id: req.params.teamID },
      {
        $set: {
          title: req.body.title,
          featured_id: req.body.featured_id,
          slug: slug,
          except: req.body.except,
          description: req.body.description,
          category_id: req.body.category_id,
          tags: req.body.tags,
          status: req.body.status,
          author_id: req.body.author_id,
          fantacy_id: req.body.fantacy_id,
          comment_id: comment_id,
          comment_status: req.body.comment_status,
          comment_count: "3",
          date: formattedDateTime,
        },
      },
      { new: true }
    );
    // const teams = await Teams.findById({ _id: req.params.teamID });
    // const media = await Media.find();
    if (!updatedDocument) {
      res.redirect(
        `/all-update-prediction/${req.params.teamID}?code=1?message=Update Successfuly ! `
      );
    } else {
      res.redirect("/all-prediction");
    }
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in author",
      error: error,
    });
  }
};




// success

exports.successData = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("status/success", {
      data: undefined,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("status/success", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// all ordwers
exports.allOrders = async (req, res, next) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.razorpay.com/v1/orders/",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic cnpwX3Rlc3RfY0ZsMm1VUmgyY3R5dVc6YTFHRGFlZ2lsTUNEQk9KTUtFRTVpUk5h",
      },
    };

    // Make HTTP request using axios
    const response = await axios(options);
    console.log(response.data);
    // Pass the data to the EJS template
    // res.render('index', { orders: response.data });
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("orders/all-order", {
      data: response.data,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("orders/all-order", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// all  transactions
exports.allTransaction = async (req, res, next) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.razorpay.com/v1/payments/",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic cnpwX3Rlc3RfY0ZsMm1VUmgyY3R5dVc6YTFHRGFlZ2lsTUNEQk9KTUtFRTVpUk5h",
      },
    };

    // Make HTTP request using axios
    const response = await axios(options);
    console.log(response.data);
    // Pass the data to the EJS template
    // res.render('index', { orders: response.data });
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("orders/transaction", {
      data: response.data,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("transactions/all-transaction", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

0;
// all Customer
exports.allCustomers = async (req, res, next) => {
  try {
    const revePrediction = await User.find();

    // console.log(revePrediction);
    const user = revePrediction.reverse();
    // console.log(user)
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("orders/customers", {
      data: user,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("orders/customers", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// delete
exports.deleteSingleCustomer = async (req, res, next) => {
  try {
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };
    const user = await User.findByIdAndDelete({ _id: req.params.customerID });

    res.status(200).json({
      code: 1,
      message: "Deleted Successfuly !",
    });
  } catch (error) {
    res.status(200).json({
      code: 0,
      message: "Someting went wrong!",
    });
  }
};




// all websites

exports.showAllWebsites = async (req, res, next) => {
  try {
    const allWebsites = await Websites.find()
    .populate({
      path: "logo_url",
    })

    // console.log(allWebsites);
    const RevallWebsites = allWebsites.reverse()
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("websites/all-website", {
      data: RevallWebsites,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("websites/all-website", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.showAddWebsite = async (req, res, next) => {
  try {
    const reverMedia=await Media.find();
    const media = reverMedia.reverse();

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("websites/add-website", {
      data: undefined,
      userData,
      dataMedia:media,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("websites/add-website", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.postWebsite = async (req, res, next) => {
  try {
    const trimmedSlug = req.body.name.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");
    const websiteData = new Websites({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      logo_url: req.body.logo_url,
      slug: slug,
      rating: req.body.rating,
      price: req.body.price,
      button_link: req.body.button_link,
      is_active: req.body.is_active
    });
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const website = await websiteData.save();
    // console.log(website)
    res.redirect("/backend/all-website");
    
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in Website",
      error: error,
    });
  }
};



// category

exports.postCategory = async (req, res, next) => {  
    try {
      const trimmedSlug = req.body.name.trim().toLowerCase();
      const slug = trimmedSlug.replace(/\s+/g, "-");
      const categoryData = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        slug: slug,
      });

      const userData = {
        _id: req.session.user_id,
        email: req.session.email,
        first_name: req.session.first_name,
        role: req.session.role,
        is_active: req.session.is_active,
      };

      const category = await categoryData.save();
       const allCategory= await Category.find();
       res.render("prediction/add-category", {
        data: allCategory,
        userData,
        code: undefined,
        message: "",
        currentRoute: req.path,
      });
    
      } catch (error) {
      res.status(500).json({
        code: 0,
        message: `${req.body.name} category already exits`,
        error: error,
      });
    }
};

exports.showCategoryPage = async (req, res, next) => {
  try {
    const allCategory= await Category.find();

console.log(allCategory)
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("prediction/add-category", {
      data: allCategory,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("prediction/add-category", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

// tag
exports.postTag = async (req, res, next) => {  
  try {
    const trimmedSlug = req.body.name.trim().toLowerCase();
    const slug = trimmedSlug.replace(/\s+/g, "-");
    const tagData = new Tag({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      slug: slug,
    });

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    const tag = await tagData.save();
     const allTag= await Tag.find();
     res.render("prediction/add-tag", {
      data: allTag,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  
    } catch (error) {
    res.status(500).json({
      code: 0,
      message: `${req.body.name} tag already exits`,
      error: error,
    });
  }
};

exports.showTagPage = async (req, res, next) => {
try {
  const allTag= await Tag.find();

console.log(allTag)
  const userData = {
    _id: req.session.user_id,
    email: req.session.email,
    first_name: req.session.first_name,
    role: req.session.role,
    is_active: req.session.is_active,
  };

  res.render("prediction/add-tag", {
    data: allTag,
    userData,
    code: undefined,
    message: "",
    currentRoute: req.path,
  });
} catch (error) {
  res.render("prediction/add-tag", {
    userData: undefined,
    data: undefined,
    code: undefined,
    message: "Something went wrong",
    currentRoute: req.path,
  });
}
};




// all matches

exports.showAllMatches = async (req, res, next) => {
  try {
    const allMatches = await Matches.find()
    .populate({
      path: "featured_id",
    })

    // console.log(allMatches);
    const RevallMatches = allMatches.reverse()
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("Matches/all-matches", {
      data: RevallMatches,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("Matches/all-matches", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.showAddMatches = async (req, res, next) => {
  try {
    const reverMedia=await Media.find();
    const media = reverMedia.reverse();

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("Matches/add-matches", {
      data: undefined,
      userData,
      dataMedia:media,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("Matches/add-website", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.postMatches = async (req, res, next) => {
  try {
    console.log(req.body)
    const matchesData = new Matches({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      featured_id: req.body.featured_id,
      alt_text: req.body.alt_text,
      link: req.body.link,
      is_active: req.body.is_active
    });
    

    const website = await matchesData.save();
    // console.log(website)
    res.redirect("/backend/all-matches");
    
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in Website",
      error: error,
    });
  }
};



// all Promotions

exports.showAllPromotions = async (req, res, next) => {
  try {
    const allPromotions = await Promotions.find()
    .populate({
      path: "featured_id",
    })

    // console.log(allMatches);
    const RevallMatches = allPromotions.reverse()
    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("promotion/all-promotion", {
      data: RevallMatches,
      userData,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("promotion/all-promotion", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.showAddPromotions = async (req, res, next) => {
  try {
    const reverMedia=await Media.find();
    const media = reverMedia.reverse();

    const userData = {
      _id: req.session.user_id,
      email: req.session.email,
      first_name: req.session.first_name,
      role: req.session.role,
      is_active: req.session.is_active,
    };

    res.render("promotion/add-promotion", {
      data: undefined,
      userData,
      dataMedia:media,
      code: undefined,
      message: "",
      currentRoute: req.path,
    });
  } catch (error) {
    res.render("promotion/add-promotion", {
      userData: undefined,
      data: undefined,
      code: undefined,
      message: "Something went wrong",
      currentRoute: req.path,
    });
  }
};

exports.postPromotions= async (req, res, next) => {
  try {
    console.log(req.body)
    const matchesData = new Promotions({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      featured_id: req.body.featured_id,
      alt_text: req.body.alt_text,
      link: req.body.link,
      is_active: req.body.is_active
    });
    

    const website = await matchesData.save();
    // console.log(website)
    res.redirect("/backend/all-promotions");
    
  } catch (error) {
    res.status(500).json({
      code: 0,
      message: "Something went wrong in Website",
      error: error,
    });
  }
};
