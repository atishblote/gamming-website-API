const express = require('express')
const router = express.Router()
const tag = require('../controllers/tagController')

router.get("/", tag.geTags)
router.post("/", tag.postTags)
router.get("/:tagID", tag.getSingleTag)

module.exports = router