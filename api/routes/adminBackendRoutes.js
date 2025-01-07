
const express = require('express')

const session = require('express-session');
const crypto = require('crypto'); // Import the crypto library
const adminBackend_routes = express()
const multer = require("multer");
// const { storage } = require('../../config/cloudnary');
// const upload = multer({ storage });
const fs = require("fs"); // Node.js file system module
const adminControllerBack = require('../controllers/adminBackendController')
const adminMediaController = require('../controllers/adminMediaUpload')
const isAdminAuth = require('../middelware/isAdminMiddelware')
const sessionSecret = crypto.randomBytes(32).toString('hex');

const uploads = multer({
  storage: multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + "-" + file.originalname
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only JPEG or PNG files are allowed."), false); // Reject the file
    }
  },
  limits: { fileSize: 102400 },
}).single("img_upload");



adminBackend_routes.use(session({
    secret: sessionSecret, // Set the session secret
    resave: false,
    saveUninitialized: true,
  }));



adminBackend_routes.get('/', isAdminAuth.isLogout,adminControllerBack.admnLogin)
adminBackend_routes.post('/', adminControllerBack.checkAdmnLogin)


// dashboard
adminBackend_routes.get('/dashboard',isAdminAuth.isLogin ,  adminControllerBack.showDashboard)

// teams
adminBackend_routes.get('/all-teams',isAdminAuth.isLogin ,  adminControllerBack.allTeams)

adminBackend_routes.get('/add-teams',isAdminAuth.isLogin ,  adminControllerBack.addTeams)
adminBackend_routes.post('/add-teams',isAdminAuth.isLogin ,  adminControllerBack.addNewTeams)

adminBackend_routes.post('/all-teams/:teamID', adminControllerBack.deletSingleTeams)
// adminBackend_routes.post('/all-teams/:updateID', adminControllerBack.updateSingleTeams)
adminBackend_routes.get('/all-update-teams/:singleId' ,isAdminAuth.isLogin, adminControllerBack.getUpdateSingleTeamsId)
// adminBackend_routes.get('/all-update-teams/:singleId', isAdminAuth.isLogin ,  adminControllerBack.allUpdateSingleTeams)
adminBackend_routes.post('/all-update-teams/:teamID' ,isAdminAuth.isLogin,  adminControllerBack.postUpdateSingleTeams)

//media
adminBackend_routes.get('/all-media',isAdminAuth.isLogin ,  adminMediaController.allMedias)

adminBackend_routes.get('/add-media',isAdminAuth.isLogin ,  adminMediaController.addMedias)
adminBackend_routes.post('/add-media',uploads,isAdminAuth.isLogin ,  adminMediaController.addSingleMedia)
adminBackend_routes.post('/all-media/:mediaID' ,  adminMediaController.deleteSingleMedia)


//packages
adminBackend_routes.get('/all-packages',isAdminAuth.isLogin ,  adminControllerBack.allPackages)

adminBackend_routes.get('/add-package',isAdminAuth.isLogin ,  adminControllerBack.addPackage)
adminBackend_routes.post('/add-package',isAdminAuth.isLogin ,  adminControllerBack.addNewPackage)
adminBackend_routes.post('/all-packages/:packID' ,  adminControllerBack.deleteSinglePackage)
adminBackend_routes.post('/update-packages/:updateID', adminControllerBack.updateSinglePackage)

adminBackend_routes.get('/all-update-packages/:singleId' ,isAdminAuth.isLogin, adminControllerBack.getSinglePackages)
adminBackend_routes.post('/all-update-packages/:teamID' ,isAdminAuth.isLogin,  adminControllerBack.postUpdatePackages)


// fantasy
adminBackend_routes.get('/all-fantacy',isAdminAuth.isLogin ,  adminControllerBack.allFantacy)

adminBackend_routes.get('/add-fantacy',isAdminAuth.isLogin ,  adminControllerBack.addFantacy)
adminBackend_routes.post('/add-fantacy',isAdminAuth.isLogin ,  adminControllerBack.addNewFantacy)

adminBackend_routes.get('/all-update-fantacy/:singleId' ,isAdminAuth.isLogin, adminControllerBack.getSingleFantacy)
adminBackend_routes.post('/all-update-fantacy/:teamID' ,isAdminAuth.isLogin,  adminControllerBack.postUpdateSingleFantacy)


adminBackend_routes.post('/all-fantacy/:fantacyID', adminControllerBack.deleteSingleFantacy)
adminBackend_routes.post('/update-fantacy/:updateID', adminControllerBack.updateSingleFantacy)



// Blog
adminBackend_routes.get('/all-blog' ,isAdminAuth.isLogin,  adminControllerBack.allPrediction)

adminBackend_routes.get('/add-blog',isAdminAuth.isLogin, adminControllerBack.addPrediction)
adminBackend_routes.post('/add-blog',isAdminAuth.isLogin ,adminControllerBack.addSinglePrediction)
adminBackend_routes.post('/all-blog/:predID' ,  adminControllerBack.deleteSinglePrediction)
adminBackend_routes.post('/update-blog/:updateID', adminControllerBack.updateSinglePrediction)

adminBackend_routes.get('/all-update-blog/:singleId' ,isAdminAuth.isLogin, adminControllerBack.getSinglepPrediction)
adminBackend_routes.post('/all-update-blog/:teamID' ,isAdminAuth.isLogin,  adminControllerBack.postUpdateSinglePrediction)
adminBackend_routes.get('/add-blog-category' ,isAdminAuth.isLogin,  adminControllerBack.showCategoryPage)
adminBackend_routes.post('/add-blog-category' ,isAdminAuth.isLogin,  adminControllerBack.postCategory)

adminBackend_routes.get('/add-blog-tag' ,isAdminAuth.isLogin,  adminControllerBack.showTagPage)
adminBackend_routes.post('/add-blog-tag' ,isAdminAuth.isLogin,  adminControllerBack.postTag)


// all orders
adminBackend_routes.get('/all-order' ,isAdminAuth.isLogin,  adminControllerBack.allOrders)

// all  transaction
adminBackend_routes.get('/all-transactions' ,isAdminAuth.isLogin,  adminControllerBack.allTransaction)

// All Customer
adminBackend_routes.get('/all-customers' ,isAdminAuth.isLogin,  adminControllerBack.allCustomers)
adminBackend_routes.post('/all-customers/:customerID' ,  adminControllerBack.deleteSingleCustomer)

// adminBackend_routes.post('/success/:fantacyID',isAdminAuth.isLogin,adminControllerBack.deleteSinglePrediction)

//success
adminBackend_routes.get('/success/:fantacyID' ,isAdminAuth.isLogin,  adminControllerBack.successData)

// Website
adminBackend_routes.get('/all-website' ,isAdminAuth.isLogin,  adminControllerBack.showAllWebsites)
adminBackend_routes.get('/add-website' , isAdminAuth.isLogin,  adminControllerBack.showAddWebsite)
adminBackend_routes.post('/add-website' , isAdminAuth.isLogin,  adminControllerBack.postWebsite)


// Matches
adminBackend_routes.get('/all-matches' ,isAdminAuth.isLogin,  adminControllerBack.showAllMatches)
adminBackend_routes.get('/add-matches' , isAdminAuth.isLogin,  adminControllerBack.showAddMatches)
adminBackend_routes.post('/add-matches' , isAdminAuth.isLogin,  adminControllerBack.postMatches)


// promotions
adminBackend_routes.get('/all-promotions' ,isAdminAuth.isLogin,  adminControllerBack.showAllPromotions)
adminBackend_routes.get('/add-promotions' , isAdminAuth.isLogin,  adminControllerBack.showAddPromotions)
adminBackend_routes.post('/add-promotions' , isAdminAuth.isLogin,  adminControllerBack.postPromotions)

module.exports = adminBackend_routes