const express = require("express");
const router = express.Router();
const Media = require("../controllers/mediaController");
const multer = require("multer");
const fs = require("fs"); // Node.js file system module
 //const upload = multer({ dest: 'uploads/' });

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



router.get("/",Media.getMedia)

router.post("/",uploads,Media.postMedia)


module.exports = router